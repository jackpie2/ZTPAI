# from rest_framework import permissions
# from ztpai.api.models import Group, UserGroup
# from ztpai.api.serializers import UserGroupSerializer


# class IsAdmin(permissions.BasePermission):
#     def has_permission(self, request, view):
#         if request.user.id is None:
#             return False
#         user_id = request.user.id
#         user_group = UserGroup.objects.get(user=user_id).group.name
#         return user_group == 'admin'


# class HasToken(permissions.BasePermission):
#     def has_permission(self, request, view):
#         return request.user.id is not None
