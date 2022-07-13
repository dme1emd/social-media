from django.db import models
from profiles.models import Profile
import uuid
# Create your models here.
class Publication(models.Model):
    description = models.CharField(max_length=300 , null=True,blank=True)
    pic = models.ImageField(upload_to='publication')
    sender = models.ForeignKey(Profile ,related_name='publication_set',on_delete=models.CASCADE)
class Comment(models.Model):
    content = models.CharField(max_length=200)
    sender = models.ForeignKey(Profile,on_delete=models.CASCADE)
    publication = models.ForeignKey('Publication',related_name="comment_set",on_delete=models.CASCADE)
    def __str__(self):
        return f"{self.id}"
    class Meta:
        ordering=['-pk']
class Like(models.Model):
    sender = models.ForeignKey(Profile,on_delete=models.CASCADE)
    publication = models.ForeignKey('Publication',related_name="like_set",on_delete=models.CASCADE)
class Follow(models.Model):
    follower = models.ForeignKey(Profile,related_name="following",on_delete=models.CASCADE)
    following = models.ForeignKey(Profile,related_name="follower",on_delete=models.CASCADE)
    def __str__(self):
        return self.follower.username + ' follows ' + self.following.username
