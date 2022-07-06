import email
from pyexpat import model
from django.db import models
from django.contrib.auth.models import BaseUserManager , AbstractBaseUser , PermissionsMixin
from django.forms import EmailField
# Create your models here.
class ProfileManager(BaseUserManager):
    def create_user(self  , username , bio, password = None) : 
        user = self.model(username=username , bio = bio)
        user.set_password(password)
        user.save(using=self._db)
        return user
    def create_superuser(self , username , bio , password = None) :
        user = self.create_user( username , bio , password)
        user.is_superuser = True
        user.save(using=self._db)
        return user
class Profile(PermissionsMixin , AbstractBaseUser):
    username = models.CharField(max_length=30 , unique=True)
    bio = models.CharField(max_length=150)
    profile_pic = models.ImageField(upload_to='profile_pic')
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    objects= ProfileManager()
    USERNAME_FIELD = 'username'
    def __str__(self):
        return self.username
