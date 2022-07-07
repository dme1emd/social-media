from rest_framework import serializers
from profiles.models import *
from publication.models import *
class ProfileSerializer(serializers.ModelSerializer):
    publication_set = serializers.PrimaryKeyRelatedField(queryset=Publication.objects.all(),many=True)
    following = serializers.PrimaryKeyRelatedField(queryset=Publication.objects.all(),many=True)
    follower = serializers.PrimaryKeyRelatedField(queryset=Publication.objects.all(),many=True)

    class Meta : 
        model = Profile
        fields = ['username','password','bio','profile_pic','publication_set']
        extra_kwargs={
            'password':{'write_only':True}
        }
class PublicationSerializer(serializers.ModelSerializer):
    like_set = serializers.PrimaryKeyRelatedField(queryset=Like.objects.all(),many=True)
    comment_set = serializers.PrimaryKeyRelatedField(queryset=Comment.objects.all(),many=True)
    class Meta : 
        model = Publication
        fields = ['description','pic','sender','comment_set','like_set']
class CommentSerializer(serializers.ModelSerializer):
    class Meta : 
        model = Comment
        fields = ['content','sender','publication']
class LikeSerializer(serializers.ModelSerializer):
    class Meta : 
        model = Like
        fields = ['sender','publication']
class FollowSerializer(serializers.ModelSerializer):
    class Meta : 
        model = Follow
        fields = '__all__'