from tkinter.tix import Tree

from django.http import HttpResponse
from .serializers import *
from profiles.models import *
from publication.models import *
from rest_framework import generics , response , decorators ,views
from .permissions import isProfileOrReadOnly, isSenderOrReadOnly
# Create your views here.
class ProfileListCreateApiView(generics.ListCreateAPIView):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()
    def perform_create(self, serializer):
        if serializer.is_valid():
            user =Profile.objects.create_user(username=serializer.validated_data.get('username'),password=serializer.validated_data.get('password'))
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
    serializer_class = HomePublicationSerializer
    queryset = Publication.objects.all()
    permission_classes=[isSenderOrReadOnly]
class CommentListCreateApiView(views.APIView):
    def post(self,request,format=None):
        p = Comment.objects.create(content=request.data.get('content'),sender=Profile.objects.get(id=request.data.get('sender')),publication=Publication.objects.get(id=request.data.get('publication')))
        p.save()
        return response.Response({'d':'e'})
class CommentRetrieveUpdateDestroyApiView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all().order_by('-id')
    permission_classes=[isSenderOrReadOnly]
class LikeListCreateApiView(generics.ListCreateAPIView):
    serializer_class = LikeSerializer
    queryset = Like.objects.all()
class LikeDislikeApiView(views.APIView):
    def post(self,request,format=None):
        Like.objects.create(sender=Profile.objects.get(id=request.data.get('sender')),publication=Publication.objects.get(id=request.data.get('publication')))
        return response.Response({'msg':'liked'})
    def delete(self,request,format=None):
        Like.objects.get(sender=Profile.objects.get(id=request.data.get('sender')),publication=Publication.objects.get(id=request.data.get('publication'))).delete()
        return response.Response({'msg':'disliked'})
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
    
    