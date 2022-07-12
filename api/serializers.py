from dataclasses import field
from rest_framework import serializers
from profiles.models import *
from publication.models import *
class PublicationSerializer(serializers.HyperlinkedModelSerializer):
    like_set = serializers.HyperlinkedRelatedField(many=True, view_name='like_rud', read_only=True)
    comment_set = serializers.HyperlinkedRelatedField(many=True, view_name='comment_rud', read_only=True)
    class Meta : 
        model = Publication
        fields = ['description','pic','sender','comment_set','like_set']
class ProfileSerializer(serializers.HyperlinkedModelSerializer):
    publication_set = serializers.HyperlinkedRelatedField(many=True, view_name='profile_rud', read_only=True)
    following = serializers.HyperlinkedRelatedField(many=True, view_name='follow_rud', read_only=True)
    follower = serializers.HyperlinkedRelatedField(many=True, view_name='follow_rud', read_only=True)

    class Meta : 
        model = Profile
        fields = ['username','password','bio','profile_pic','publication_set','following','follower']
        extra_kwargs={
            'following':{'required':False},
            'follower':{'required':False},
            'publication_set':{'required':False},
            
        }
class PublicationSerializer(serializers.HyperlinkedModelSerializer):
    like_set = serializers.PrimaryKeyRelatedField(read_only=True)
    comment_set =serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Publication
        fields = ['description','pic','sender','comment_set','like_set']
class CommentSerializer(serializers.HyperlinkedModelSerializer):
    sender = ProfileSerializer(many=True)
    class Meta : 
        model = Comment
        fields = ['content','sender','publication']
class LikeSerializer(serializers.HyperlinkedModelSerializer):
    sender = ProfileSerializer()
    class Meta : 
        model = Like
        fields = ['sender','publication']
class FollowSerializer(serializers.HyperlinkedModelSerializer):
    class Meta : 
        model = Follow
        fields = '__all__'
class HomeProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=Profile
        fields = ['username','profile_pic']
class HomePublicationSerializer(serializers.ModelSerializer):
    sender = ProfileSerializer()
    comment_set = CommentSerializer(many=True)
    like_set = LikeSerializer(many=True)
    class Meta :
        model  = Publication
        fields = ['description','pic','sender','comment_set','like_set'] 
