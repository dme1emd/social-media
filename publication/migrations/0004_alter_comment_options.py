# Generated by Django 3.2.6 on 2022-07-18 10:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('publication', '0003_auto_20220713_1908'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='comment',
            options={'ordering': ['-pk']},
        ),
    ]
