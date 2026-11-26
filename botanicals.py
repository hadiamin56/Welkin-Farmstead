"""Hand-built line-art botanicals (SVG symbols) used as decoration. Imported by build.py."""
import math


def f(n):
    return f'{n:.1f}'.rstrip('0').rstrip('.')


def leaf(x, y, rot, l, w):
    """Outlined leaf with midrib. rot=0 points up, positive = clockwise (degrees)."""
    return (f'<g transform="translate({f(x)} {f(y)}) rotate({f(rot)})">'
            f'<path d="M0 0C{f(w)} {f(-l*.25)} {f(w)} {f(-l*.75)} 0 {f(-l)}C{f(-w)} {f(-l*.75)} {f(-w)} {f(-l*.25)} 0 0Z"/>'
            f'<path d="M0 -3L0 {f(-l*.82)}"/></g>')


def poly(pts):
    return 'M' + 'L'.join(f'{f(x)} {f(y)}' for x, y in pts)


def bez(p0, p1, p2, p3, t):
    u = 1 - t
    x = u**3*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t**3*p3[0]
    y = u**3*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t**3*p3[1]
    dx = 3*u*u*(p1[0]-p0[0]) + 6*u*t*(p2[0]-p1[0]) + 3*t*t*(p3[0]-p2[0])
    dy = 3*u*u*(p1[1]-p0[1]) + 6*u*t*(p2[1]-p1[1]) + 3*t*t*(p3[1]-p2[1])
    ang = math.degrees(math.atan2(dx, -dy))  # 0 = up
    return x, y, ang


def apple(cx, cy, r, leafy=True):
    c = lambda a, b: f'{f(cx + a*r)} {f(cy + b*r)}'
    d = (f'M{c(0,-.55)}C{c(-.5,-1.0)} {c(-1.25,-.5)} {c(-1.05,.2)}C{c(-.9,.9)} {c(-.3,1.15)} {c(0,.95)}'
         f'C{c(.3,1.15)} {c(.9,.9)} {c(1.05,.2)}C{c(1.25,-.5)} {c(.5,-1.0)} {c(0,-.55)}Z')
    s = f'<path d="{d}"/>'
    s += f'<path d="M{c(0,-.55)}C{c(0,-.9)} {c(.1,-1.1)} {c(.28,-1.32)}"/>'
    s += f'<path d="M{c(-.62,-.05)}Q{c(-.6,-.5)} {c(-.22,-.62)}" opacity=".7"/>'
    if leafy:
        s += leaf(cx + .28*r, cy - 1.15*r, 62, r*.85, r*.3)
    return s


def tree_at(cx, base, h, apples=True):
    k = h / 200.0
    X = lambda px: cx + (px - 80) * k
    Y = lambda py: base - (200 - py) * k
    P = lambda a, b: f'{f(X(a))} {f(Y(b))}'
    s = f'<path d="M{P(77,200)}L{P(78,126)}M{P(83,200)}L{P(82,126)}M{P(80,160)}L{P(56,118)}M{P(80,148)}L{P(106,108)}"/>'
    s += (f'<path d="M{P(30,122)}C{P(0,112)} {P(0,72)} {P(30,64)}C{P(28,30)} {P(70,14)} {P(90,34)}'
          f'C{P(110,10)} {P(150,30)} {P(140,64)}C{P(166,74)} {P(160,114)} {P(130,122)}C{P(118,142)} {P(42,142)} {P(30,122)}Z"/>')
    if apples:
        for a, b in ((52, 80), (90, 66), (118, 92), (74, 108), (104, 120), (40, 104)):
            s += f'<circle cx="{f(X(a))}" cy="{f(Y(b))}" r="{f(max(2.2, 4.2*k))}"/>'
    return s


def sym(id_, vb, body):
    return (f'<symbol id="{id_}" viewBox="{vb}" fill="none" stroke="currentColor" '
            f'stroke-linecap="round" stroke-linejoin="round">{body}</symbol>')


def sprig():
    pts, leaves = [], ''
    n = 40
    for i in range(n + 1):
        t = i / n
        pts.append((100 + 16*math.sin(t*3.2), 310 - 290*t))
    for k in range(1, 9):
        t = k / 9.2
        x = 100 + 16*math.sin(t*3.2); y = 310 - 290*t
        side = 1 if k % 2 else -1
        L = 74 - k*4.2
        leaves += leaf(x, y, side*52, L, L*.33)
    leaves += leaf(pts[-1][0], pts[-1][1], 6, 52, 16)
    return sym('a-sprig', '0 0 200 320', f'<path d="{poly(pts)}"/>{leaves}')


def apple_branch():
    p0, p1, p2, p3 = (0, 252), (120, 276), (230, 140), (380, 66)
    pts = [bez(p0, p1, p2, p3, i / 40)[:2] for i in range(41)]
    s = f'<path d="{poly(pts)}"/>'
    twig = [bez((150, 214), (176, 190), (190, 160), (214, 140), i / 12)[:2] for i in range(13)]
    s += f'<path d="{poly(twig)}"/>'
    for t, sd, L in ((.12, -1, 46), (.24, 1, 50), (.36, -1, 52), (.48, 1, 52), (.6, -1, 48), (.7, 1, 46), (.82, -1, 40), (.92, 1, 36)):
        x, y, a = bez(p0, p1, p2, p3, t)
        s += leaf(x, y, a + sd*58, L, L*.32)
    s += leaf(380, 66, 40, 44, 14)
    for t, r in ((.3, 36), (.55, 33), (.8, 29)):
        x, y, a = bez(p0, p1, p2, p3, t)
        s += f'<path d="M{f(x)} {f(y)}Q{f(x+4)} {f(y+16)} {f(x+2)} {f(y+r*.55+14)}"/>' + apple(x + 2, y + r*1.55 + 14, r, leafy=False)
    return sym('a-apple-branch', '0 0 390 320', s)


def apple_icon():
    return sym('a-apple', '0 0 60 70', apple(30, 40, 20))


def fish():
    s = ('<path d="M12 55C40 18 110 10 180 48L228 20Q214 55 228 90L180 62C110 100 40 92 12 55Z"/>'
         '<path d="M92 24Q112 2 142 30"/><path d="M130 82Q148 100 162 90"/><path d="M70 64Q88 82 102 74"/>'
         '<path d="M58 34Q68 55 58 76"/><circle cx="36" cy="50" r="4"/>'
         '<path d="M22 56C80 52 140 54 182 56" stroke-dasharray="3 6"/>')
    for x, y in ((78, 38), (98, 34), (118, 38), (138, 44), (88, 48), (110, 46), (130, 52), (150, 50), (104, 62), (126, 66)):
        s += f'<circle cx="{x}" cy="{y}" r="1.6"/>'
    return sym('a-fish', '0 0 240 110', s)


def tree():
    return sym('a-tree', '0 0 160 205', tree_at(80, 202, 200))


def treeline():
    s = ''
    xs = [(60, 110), (170, 82), (270, 120), (390, 90), (500, 116), (610, 78), (720, 118), (830, 92), (940, 112), (1050, 84), (1150, 108)]
    for x, h in xs:
        s += tree_at(x, 150, h, apples=False)
    s += '<path d="M0 150H1200"/>'
    return sym('a-treeline', '0 0 1200 156', s)


def wheat():
    s = '<path d="M45 238C42 170 50 110 45 30"/>'
    for k in range(7):
        y = 38 + k*22
        s += f'<ellipse cx="33" cy="{y+8}" rx="6" ry="13" transform="rotate(-28 33 {y+8})"/>'
        s += f'<ellipse cx="57" cy="{y+8}" rx="6" ry="13" transform="rotate(28 57 {y+8})"/>'
    s += '<ellipse cx="45" cy="18" rx="6" ry="14"/>' + leaf(45, 236, -38, 96, 14) + leaf(46, 228, 36, 84, 12)
    return sym('a-wheat', '-24 0 138 240', s)


def sheep():
    s = ('<path d="M44 68C30 64 28 46 42 42C42 28 60 22 70 30C78 18 100 18 108 30C122 24 140 34 136 48C150 52 152 70 138 76'
         'C138 86 124 90 116 84L58 84C50 90 38 84 44 68Z"/>'
         '<ellipse cx="24" cy="58" rx="13" ry="18" transform="rotate(-14 24 58)"/>'
         '<path d="M16 44Q8 40 6 48Q10 54 18 52"/><circle cx="20" cy="54" r="2"/>'
         '<path d="M56 84V110M68 86V110M104 86V110M118 84V110"/>')
    return sym('a-sheep', '0 0 170 116', s)


def cherries():
    s = ('<path d="M40 84C42 56 62 32 84 16M92 90C90 60 88 38 84 16"/>'
         '<circle cx="40" cy="108" r="24"/><circle cx="92" cy="114" r="24"/>'
         '<path d="M26 100Q28 90 36 88M78 106Q80 96 88 94" opacity=".7"/>' + leaf(84, 16, 64, 46, 15))
    return sym('a-cherries', '0 -16 130 182', s)


def cloud():
    return sym('a-cloud', '0 0 160 72',
               '<path d="M30 60C10 60 6 36 26 32C26 14 52 8 62 24C70 6 102 8 108 30C130 24 148 44 132 60Z"/>')


def waves():
    d = ''.join(f'<path d="M0 {y}q25 -14 50 0t50 0t50 0t50 0t50 0t50 0t50 0t50 0"/>' for y in (14, 34, 54))
    return sym('a-waves', '0 0 400 68', d)


def sprite():
    parts = [sprig(), apple_branch(), apple_icon(), fish(), tree(), treeline(), wheat(), sheep(), cherries(), cloud(), waves()]
    return '<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>' + ''.join(parts) + '</defs></svg>'


VB = {
    'sprig': '0 0 200 320', 'apple-branch': '0 0 390 320', 'apple': '0 0 60 70', 'fish': '0 0 240 110', 'tree': '0 0 160 205',
    'treeline': '0 0 1200 156', 'wheat': '-24 0 138 240', 'sheep': '0 0 170 116', 'cherries': '0 -16 130 182', 'cloud': '0 0 160 72', 'waves': '0 0 400 68',
}


def d(name, pos='tr', w=300, rot=0, flip=False, cls='', op=None, at=''):
    """Decorative absolutely-positioned drawing."""
    st = f'--w:{w}px;{at};' if at else f'--w:{w}px;'
    tr = []
    if rot:
        tr.append(f'rotate({rot}deg)')
    if flip:
        tr.append('scaleX(-1)')
    if tr:
        st += 'transform:' + ' '.join(tr) + ';'
    if op is not None:
        st += f'opacity:{op};'
    return f'<svg class="deco {pos} {cls}" viewBox="{VB[name]}" style="{st}" aria-hidden="true" focusable="false"><use href="#a-{name}"/></svg>'


def icon(name, cls=''):
    return f'<svg class="ai {cls}" viewBox="{VB[name]}" aria-hidden="true" focusable="false"><use href="#a-{name}"/></svg>'
