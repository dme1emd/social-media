from .serializers import *
from profiles.models import *
from publication.models import *
from rest_framework import generics , response
from .permissions import isProfileOrReadOnly, isSenderOrReadOnly
# Create your views here.
class ProfileListCreateApiView(generics.ListCreateAPIView):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()
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