
import pika
from dotenv import dotenv_values
import psycopg

config = dotenv_values("queue/.env")

connection = pika.BlockingConnection(pika.ConnectionParameters(config['PIKAHOST'],
                                                               credentials=pika.PlainCredentials(
                                                                   config['PIKAUSER'], config['PIKAPASS'])
                                                               ))
channel = connection.channel()
channel.queue_declare(queue='email')

with psycopg.connect(config["DBSTRING"]) as conn:
    with conn.cursor() as cur:
        cur.execute(
            "SELECT email, (SELECT id FROM public.api_coffee where id not in (select coffee_id from public.api_coffeerating where user_id = public.auth_user.id) ORDER BY RANDOM() LIMIT 1) FROM public.auth_user")
        matches = cur.fetchall()
        print(matches)
        for email, coffee_id in matches:
            if coffee_id is not None:
                channel.basic_publish(exchange='',
                                      routing_key='email',
                                      body=f"{email};{coffee_id}")

connection.close()
