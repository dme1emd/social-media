from django.db import reset_queries
from .serializers import *
from profiles.models import *
from publication.models import *
from rest_framework import generics , response , decorators ,views, filters
from .permissions import isProfileOrReadOnly, isSenderOrReadOnly
# Create your views here.
class ProfileListCreateApiView(generics.ListCreateAPIView):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()
    filter_backends = (filters.SearchFilter,)
    search_fields = ['username',]
    def perform_create(self, serializer):
        if serializer.is_valid():
            user =Profile.objects.create_user(username=serializer.validated_data.get('username'),password=serializer.validated_data.get('password'))
            user.profile_pic = serializer.context.get('request').FILES.get('profile_pic')
            user.save()
@decorators.api_view(['GET'])          
def profile_page(request,pk):
    profile =Profile.objects.get(pk=pk)
    serializer = ProfilePageSerializer(instance =profile ,context={'request': request},many=False).data
    return response.Response(serializer)
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
class FollowApiView(views.APIView):
    def post(self,request,format=None):
        Follow.objects.create(follower=Profile.objects.get(id=request.data.get('follower')),following=Profile.objects.get(id=request.data.get('following')))
        return response.Response({'msg':'liked'})
    def delete(self,request,format=None):
        Follow.objects.get(follower=Profile.objects.get(id=request.data.get('follower')),following=Profile.objects.get(id=request.data.get('following'))).delete()
        return response.Response({'msg':'disliked'})
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
@decorators.api_view(['GET'])
def invitations_api(request , pk):
    queryset = Invitation.objects.filter(invited__id = pk)
    serializer = InvitationSerializer(queryset,many=True)
    return response.Response(serializer.data)
@decorators.api_view(['GET','DELETE','POST'])
def notification_api(request , pk=None): 
    if request.method == 'GET':
        qs = Notification.objects.filter(to__id = pk).order_by('-id')
        serializer = NotificationSerializer(qs , many=True)
        return response.Response(serializer.data)
    if request.method =='DELETE':
        Notification.objects.get(pk=pk).delete()
        return response.Response({"message":"deleted"})
    return response.Response({'message' : 'not allowed'})
def invitation_api(request , pk=None): 
    if request.method =='DELETE':
        print(request)
    return response.Response({'message' : 'not allowed'})