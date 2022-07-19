from dataclasses import field
import profile
from rest_framework import serializers
from profiles.models import *
from publication.models import *
class PublicationSerializer(serializers.ModelSerializer):
    like_set = serializers.PrimaryKeyRelatedField(read_only=True)
    comment_set = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta : 
        model = Publication
        fields = ['description','pic','sender','comment_set','like_set']
class ProfileSerializer(serializers.ModelSerializer):
    class Meta :
        model = Profile
        fields = ['id','username','password','bio','profile_pic','following','follower','is_private','invitation_to','invitation_from']
        extra_kwargs={
            'following':{'required':False},
            'follower':{'required':False},
            'publication_set':{'required':False , 'read_only':True},   
        }


class PublicationSerializer(serializers.ModelSerializer):
    like_set = serializers.PrimaryKeyRelatedField(read_only=True)
    comment_set =serializers.PrimaryKeyRelatedField(read_only=True)
    id = serializers.SerializerMethodField()
    class Meta:
        model = Publication
        fields = ['id','description','pic','sender','comment_set','like_set']
    def get_id(self,obj):
        return obj.id
class InvitationSerializer(serializers.ModelSerializer):
    invitor = ProfileSerializer()
    invited = ProfileSerializer()
    class Meta : 
        model = Invitation
        fields = ['invitor','invited']
class PublicationSerializer(serializers.ModelSerializer):
    like_set = serializers.PrimaryKeyRelatedField(read_only=True)
    comment_set =serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Publication
        fields = ['id','description','pic','sender','comment_set','like_set']
class CommentSerializer(serializers.ModelSerializer):
    sender = ProfileSerializer()
    id = serializers.IntegerField()
    class Meta : 
        model = Comment
        fields = ['id','content','sender','publication']
class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model=Comment
        fields = '__all__'
class LikeSerializer(serializers.ModelSerializer):
    sender = ProfileSerializer()
    class Meta : 
        model = Like
        fields = ['sender','publication']
class FollowSerializer(serializers.ModelSerializer):
    follower = ProfileSerializer()
    following = ProfileSerializer()
    class Meta : 
        model = Follow
        fields = ['follower','following']
class HomePublicationSerializer(serializers.ModelSerializer):
    sender = ProfileSerializer()
    comment_set = CommentSerializer(many=True)
    like_set = LikeSerializer(many=True)
    class Meta :
        model  = Publication
        fields = ['id','description','pic','sender','comment_set','like_set'] 
class PublicationProfileSerializer(serializers.ModelSerializer):
    class Meta : 
        model = Publication
        fields = ['description','pic','comment_set','like_set']
class ProfilePageSerializer(serializers.ModelSerializer):
    following = FollowSerializer(many=True)
    follower = FollowSerializer(many=True)
    invitation_from = InvitationSerializer(many=True)
    invitation_to = InvitationSerializer(many=True)
    profile_pic = serializers.ImageField(use_url=True)
    publication_set = PublicationProfileSerializer(many=True)
    class Meta :
        model = Profile
        fields = ['id','username','password','bio','profile_pic','following','follower','publication_set','is_private','invitation_to','invitation_from']
