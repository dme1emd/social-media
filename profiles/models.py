import email
from pyexpat import model
from django.db import models
from django.contrib.auth.models import BaseUserManager , AbstractBaseUser , PermissionsMixin
from django.forms import EmailField
# Create your models here.
class ProfileManager(BaseUserManager):
    def create_user(self  , username,password = None) : 
        user = self.model(username=username)
        user.set_password(password)
        user.save(using=self._db)
        return user
    def create_superuser(self , username , password = None) :
        user = self.create_user( username =username,password= password)
        user.is_superuser = True
        user.save(using=self._db)
        return user
class Profile(PermissionsMixin , AbstractBaseUser):
    username = models.CharField(max_length=30 , unique=True)
    bio = models.CharField(max_length=150 , blank=True , null=True)
    profile_pic = models.ImageField(upload_to='profile_pic', blank=True , null=True)
    is_staff = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    is_private = models.BooleanField(default=False)
    objects= ProfileManager()
    USERNAME_FIELD = 'username'
    def __str__(self):
        return f"profile object ({self.id})"
class Invitation(models.Model):
    invitor = models.ForeignKey(Profile ,related_name='invitation_to' , on_delete =models.CASCADE)
    invited = models.ForeignKey(Profile ,related_name='invitation_from' , on_delete =models.CASCADE)
    def __str__(self):
        return f"{self.invitor.username} inviting {self.invited.username}"
