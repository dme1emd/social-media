from rest_framework import permissions
class isProfileOrReadOnly(permissions.BasePermission):
    #this will allow only the user to modify his profile
    def has_object_permission(self, request, view, obj):
        if request.method =='GET':
            return True
        print("zebi")
        return request.user == obj #else it will return if the user is changing his own profile
class isSenderOrReadOnly(permissions.BasePermission):
    #this will allow only the user to modify his profile
    def has_object_permission(self, request, view, obj):
        if request.method=='GET':
            return True
        return request.user == obj.sender #else it will return if the user is the sender