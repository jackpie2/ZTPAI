from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import User
from drf_spectacular.utils import extend_schema

from rest_framework import filters, generics, permissions, status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from ztpai.api import serializers

from ztpai.api.models import (
    Coffee,
    CoffeeImage,
    CoffeeRating,
    Flavor,
    Origin,
    Roast,
    Species,
)
from ztpai.api.serializers import (
    CoffeeImageSerializer,
    CoffeeRatingSerializer,
    CoffeeSerializer,
    RefreshSerializer,
    RegisterSerializer,
    SignInSerializer,
    UserSerializer,
)


class CoffeeViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    queryset = Coffee.objects.all().order_by('-date_added')
    serializer_class = CoffeeSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'origin__name',
                     'species__name', 'flavors__name', 'roast__name', 'description']
    http_method_names = ['get', 'delete']


class SignUp(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer


@extend_schema(request=SignInSerializer)
class JWTAuth(APIView):
    serializer_class = SignInSerializer

    def get_serializer(self):
        return self.serializer_class()

    def get_serializer_class(self):
        return self.serializer_class

    def post(self, request, format=None):
        email = request.data['email']
        password = request.data['password']
        user = User.objects.filter(email=email)
        if user.exists():
            user = user.first()
            if check_password(password, user.password):
                token = RefreshToken.for_user(user)
                token['admin'] = user.is_superuser

                return Response({
                    'token': str(token.access_token),
                    'refresh': str(token)
                })
            else:
                return Response({'error': 'User not found.'}, )
        else:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)


@extend_schema(request=RefreshSerializer)
class JWTRefresh(APIView):
    serializer_class = RefreshSerializer

    def get_serializer(self):
        return self.serializer_class()

    def post(self, request, format=None):
        refresh = request.data['refresh']
        token = RefreshToken(refresh)
        token['admin'] = User.objects.get(
            email=token['email']).is_superuser
        return Response({
            'token': str(token.access_token),
            'refresh': str(token)
        })


class UsersView(generics.ListAPIView):
    permission_classes = [permissions.IsAdminUser]
    queryset = User.objects.all().order_by('-email')
    serializer_class = UserSerializer


class UserView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def retrieve(self, request, *args, **kwargs):
        user = User.objects.get(email=request.user.email)
        serializer = UserSerializer(user)
        return Response(serializer.data)


class CoffeeUserScore(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = CoffeeRating.objects.all()
    serializer_class = CoffeeRatingSerializer

    def retrieve(self, request, *args, **kwargs):
        coffee_id = self.kwargs['coffee_id']
        user_id = request.user.id
        rating = CoffeeRating.objects.filter(
            coffee=coffee_id, user=user_id).first()
        if rating is None:
            return Response({'rating': 0, 'comment': ''})
        serializer = CoffeeRatingSerializer(rating)
        return Response({
            'rating': serializer.data['rating'],
            'comment': serializer.data['comment']
        })


class RateCoffee(generics.CreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = serializers.RateCoffeeSerializer

    def post(self, request, *args, **kwargs):
        rating_data = request.data
        coffee_id = rating_data['coffee']
        user_id = request.user.id
        rating = CoffeeRating.objects.filter(
            coffee=coffee_id, user=user_id).first()
        rating_data['user'] = user_id
        rating_data['rating'] = max(0, min(5, rating_data['rating']))
        if rating is None:
            if rating_data['rating'] == 0:
                return Response({'message': 'Rating not found'}, status=status.HTTP_404_NOT_FOUND)
            serializer = CoffeeRatingSerializer(data=rating_data)
            if serializer.is_valid():
                serializer.save()
                return Response({'message': 'Rating added successfully'}, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            if rating_data['rating'] == 0:
                rating.delete()
                return Response({'message': 'Rating deleted successfully'}, status=status.HTTP_201_CREATED)
            serializer = CoffeeRatingSerializer(rating, data=rating_data)
            if serializer.is_valid():
                serializer.save()
                return Response({'message': 'Rating updated successfully'}, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AllReviews(generics.ListAPIView):
    queryset = CoffeeRating.objects.all()
    serializer_class = CoffeeRatingSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        coffee_id = self.kwargs['coffee_id']
        return CoffeeRating.objects.filter(coffee=coffee_id)


class AddCoffee(generics.CreateAPIView):
    queryset = Coffee.objects.all()
    serializer_class = CoffeeSerializer

    def post(self, request, *args, **kwargs):
        coffee_data = request.data
        coffee_data['roast'] = Roast.objects.get(name=coffee_data['roast']).pk
        origin = Origin.objects.filter(name=coffee_data['origin'])
        if origin.exists():
            coffee_data['origin'] = origin.first().pk
        else:
            coffee_data['origin'] = Origin.objects.create(
                name=coffee_data['origin']).pk

        flavors = []

        for flavor in coffee_data['flavors']:
            print(flavor)
            flavor_obj = Flavor.objects.filter(name=flavor)
            if flavor_obj.exists():
                flavors.append(flavor_obj.first().pk)
            else:
                flavors.append(Flavor.objects.create(name=flavor).pk)

        coffee_data['flavors'] = flavors if len(
            flavors) > 0 else None

        species = []

        for specie in coffee_data['species']:
            specie_obj = Species.objects.filter(name=specie)
            if specie_obj.exists():
                species.append(specie_obj.first().pk)
            else:
                species.append(Species.objects.create(name=specie).pk)

        coffee_data['species'] = species

        serializer = CoffeeSerializer(data=coffee_data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Coffee added successfully',
                             'id': serializer.data['id']
                             }, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddImage(generics.CreateAPIView):
    queryset = CoffeeImage.objects.all()
    serializer_class = CoffeeImageSerializer

    def post(self, request, *args, **kwargs):
        image = request.FILES['image']
        coffee_id = self.kwargs['coffee_id']
        serializer = CoffeeImageSerializer(data={'image': image})
        if serializer.is_valid():
            serializer.save()
            coffee = Coffee.objects.get(id=coffee_id)
            coffee_image = CoffeeImage.objects.get(id=serializer.data['id'])
            coffee.image = coffee_image
            coffee.save()
            return Response({'message': 'Image added successfully',
                             'id': serializer.data['id']
                             }, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
