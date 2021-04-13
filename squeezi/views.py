from os import stat, mkdir
from django.http.response import HttpResponse
from django.shortcuts import redirect, render
import time
from django.urls.conf import path
from django.conf import settings
import requests
from PIL import Image
from requests.api import patch
import math
import os


def save_image(file_body):
    name = str(int(time.time()))
    if not os.path.exists('static/loaded_images/'):
        mkdir('static/loaded_images/')
    f = open('static/loaded_images/'+name, 'wb')
    f.write(file_body)
    f.close()
    return 'loaded_images/'+name


def main(request):
    if request.COOKIES.get("image") != None:
        name = request.COOKIES['image']
        path = ['static'] + name.split('/')
        im = Image.open('static/'+name)
        desc = generate_description(im, name)
        path = ''.join(
            map(lambda part: f'<li class="breadcrumb-item">{part}</li>', path))
        return render(request, 'image.html', {
            'image': name, 'url': path, 'desc': desc})
    else:
        return render(request, 'empty.html')


def load_image(request):
    res = redirect('/')
    try:
        img = request.FILES['image']
        name = save_image(img.read())
        res.set_cookie('image', name)
    except Exception as e:
        return HttpResponse(e)
    return res


def check_url(request):
    url = request.GET["url"]
    res = HttpResponse()
    try:
        r = requests.head(url)
        if r.status_code / 400 >= 1:
            res.status_code = 303
        else:
            res.status_code = r.status_code
    except:
        res.status_code = 303
    return res


def generate_description(im, name):
    statinfo = stat('static/'+name)
    desc = '<strong>Size: </strong>' + str(im.width)+'x'+str(im.height) + '</br>'\
        + '<strong>Format: </strong>'+str(im.format) + '</br>'\
        + '<strong>DPI: </strong>' + str(im.info.get('dpi')) + '</br>'\
        + '<strong>Weight: </strong>' + \
        str(round(statinfo.st_size / 1024, 2)) + ' KB'
    return desc


def download_image(request):
    try:
        url = request.GET["url"]
        response = requests.get(url)
        if response.status_code == 200:
            filename = save_image(response.content)
            res = redirect('/')
            res.set_cookie('image', filename)
            return res
    except:
        pass
    return redirect('/')


def squeeze(request):
    image_path = request.COOKIES.get('image')
    res = redirect('/')
    if image_path != None:
        method = request.GET['method']

        # On client we divide it on 50 for blur effect
        quality = 100 - int(float(request.GET['reduce']) * 50)

        name = request.COOKIES['image']
        im = Image.open('static/'+name)
        ext = method.lower()

        if not os.path.exists('static/squeezed_images/'):
            mkdir('static/squeezed_images/')

        new_name = 'squeezed_images/'+str(int(time.time())) + '.' + ext

        im.save('static/'+new_name, method, quality=quality)
        res.set_cookie("image", new_name)
    return res


def reset_image(request):
    res = redirect('/')
    res.delete_cookie('image')
    return res
