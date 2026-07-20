from PIL import Image, ImageDraw

S = 256
scale = S/200
def s(x): return x*scale

img = Image.new("RGBA", (S, S), (10,10,11,255))
d = ImageDraw.Draw(img)
d.rounded_rectangle([0,0,S-1,S-1], radius=int(14*scale), fill=(10,10,11,255))

def thick_line(p1, p2, w, color):
    d.line([s(p1[0]),s(p1[1]),s(p2[0]),s(p2[1])], fill=color, width=int(w*scale), joint="curve")
    for p in (p1,p2):
        d.ellipse([s(p[0])-w*scale/2, s(p[1])-w*scale/2, s(p[0])+w*scale/2, s(p[1])+w*scale/2], fill=color)

INK=(244,241,234,255); ACC=(255,77,46,255)

thick_line((52,44),(52,132),24,INK)
thick_line((52,132),(28,132),24,INK)
thick_line((28,132),(28,158),24,INK)
thick_line((84,150),(84,44),24,INK)
thick_line((84,44),(112,110),24,INK)
thick_line((112,110),(140,44),24,INK)
thick_line((140,44),(140,150),24,INK)

def cubic(p0,p1,p2,p3,n=40):
    pts=[]
    for i in range(n+1):
        t=i/n; u=1-t
        x=u*u*u*p0[0]+3*u*u*t*p1[0]+3*u*t*t*p2[0]+t*t*t*p3[0]
        y=u*u*u*p0[1]+3*u*u*t*p1[1]+3*u*t*t*p2[1]+t*t*t*p3[1]
        pts.append((x,y))
    return pts
traj = cubic((28,158),(42,116),(64,84),(100,58)) + cubic((100,58),(138,32),(168,44),(184,40))
for i in range(len(traj)-1):
    thick_line(traj[i],traj[i+1],9,ACC)
d.polygon([(s(x),s(y)) for x,y in [(184,40),(162,30),(173,52)]], fill=ACC)
d.ellipse([s(100)-11*scale, s(58)-11*scale, s(100)+11*scale, s(58)+11*scale], fill=ACC)
d.ellipse([s(100)-4*scale, s(58)-4*scale, s(100)+4*scale, s(58)+4*scale], fill=(10,10,11,255))
rocket=[(68,118),(78,86),(62,86),(72,60),(52,90),(68,90)]
d.polygon([(s(x),s(y)) for x,y in rocket], fill=ACC)
d.ellipse([s(68)-6*scale, s(86)-6*scale, s(68)+6*scale, s(86)+6*scale], fill=ACC)

fav = img.resize((64,64), Image.LANCZOS)
fav.save("/Users/john/Desktop/Nova/portfolio/assets/favicon.png")
img.save("/Users/john/Desktop/Nova/portfolio/assets/logo-concepts/e6-rendered-256.png")
print("favicon + preview written")
