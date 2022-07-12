from tkinter.tix import Tree

from django.http import HttpResponse
from .serializers import *
from profiles.models import *
from publication.models import *
from rest_framework import generics , response , decorators
from .permissions import isProfileOrReadOnly, isSenderOrReadOnly
# Create your views here.
class ProfileListCreateApiView(generics.ListCreateAPIView):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()
    def perform_create(self, serializer):
        if serializer.is_valid():

            user =Profile.objects.create_user(username=serializer.data.get('username'),password=serializer.data.get('password'))
            user.profile_pic = serializer.context.get('request').FILES.get('profile_pic')
            user.save()
class ProfileRetrieveUpdateDestroyApiView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()
    permission_classes=[isProfileOrReadOnly]
class PublicationListCreateApiView(generics.ListCreateAPIView):
    serializer_class = PublicationSerializer
    queryset = Publication.objects.all()
class PublicationRetrieveUpdateDestroyApiView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = PublicationSerializer
    queryset = Publication.objects.all()
    permission_classes=[isSenderOrReadOnly]
class CommentListCreateApiView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()
class CommentRetrieveUpdateDestroyApiView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()
    permission_classes=[isSenderOrReadOnly]
class LikeListCreateApiView(generics.ListCreateAPIView):
    serializer_class = LikeSerializer
    queryset = Like.objects.all()
class LikeRetrieveUpdateDestroyApiView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = LikeSerializer
    queryset = Like.objects.all()
    permission_classes=[isSenderOrReadOnly]
class FollowListCreateApiView(generics.ListCreateAPIView):
    serializer_class = FollowSerializer
    queryset = Follow.objects.all()
class FollowRetrieveUpdateDestroyApiView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = FollowSerializer
    queryset = Follow.objects.all()
    permission_classes=[isSenderOrReadOnly]
@decorators.api_view(['GET'])
def home_api(request , pk ):
    queryset = Profile.objects.get(pk=pk).publication_set.all()
    for e in Profile.objects.filter(follower__follower=Profile.objects.get(pk=pk)):
        queryset = queryset | e.publication_set.all()
    queryset = queryset.order_by('-id')
    serializer =HomePublicationSerializer(queryset,context={'request': request},many=True)
    return response.Response(serializer.data)
    
    