
import threading
import pika
import pika
from dotenv import dotenv_values

config = dotenv_values("queue/.env")


def callback(ch, method, properties, body):
    body = body.decode('utf-8')
    email, coffee_id = body.split(";")
    email_content = f"""
    Consider trying our new pick for you: coffeedb.com/coffee/{coffee_id}
    """
    print(email_content)
    ch.basic_ack(delivery_tag=method.delivery_tag)


def listen():
    connection = pika.BlockingConnection(pika.ConnectionParameters(config['PIKAHOST'],
                                                                   credentials=pika.PlainCredentials(
        config['PIKAUSER'], config['PIKAPASS'])
    ))
    channel = connection.channel()
    channel.queue_declare(queue='email')
    channel.basic_consume(
        queue='email', on_message_callback=callback)

    print(' [*] Waiting for messages. To exit press CTRL+C')
    channel.start_consuming()


for i in range(1):
    t = threading.Thread(target=listen)
    t.daemon = True
    t.start()

t.join()
