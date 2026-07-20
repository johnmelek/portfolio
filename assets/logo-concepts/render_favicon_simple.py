from PIL import Image, ImageDraw, ImageFont

S = 256
scale = S/200
img = Image.new("RGBA", (S, S), (10,10,11,255))
d = ImageDraw.Draw(img)
# red rounded square background
d.rounded_rectangle([0,0,S-1,S-1], radius=int(28*scale), fill=(255,77,46,255))

# bold white JM (simplified, thick) centered
INK=(244,241,234,255)
def thick_line(p1,p2,w):
    d.line([s(p1[0]),s(p1[1]),s(p2[0]),s(p2[1])], fill=INK, width=int(w*scale), joint="curve")
    for p in (p1,p2):
        d.ellipse([s(p[0])-w*scale/2,s(p[1])-w*scale/2,s(p[0])+w*scale/2,s(p[1])+w*scale/2], fill=INK)
def s(x): return x*scale

thick_line((72,64),(72,150),40)
thick_line((72,150),(44,150),40)
thick_line((44,150),(44,176),40)
thick_line((108,170),(108,64),(40))
thick_line((108,64),(140,140),(40))
thick_line((140,140),(172,64),(40))
thick_line((172,64),(172,170),(40))

fav = img.resize((64,64), Image.LANCZOS)
fav.save("/Users/john/Desktop/Nova/portfolio/assets/favicon.png")
print("simplified bold favicon written")
