"""v2026 animated illustrations for research lines and courses.

Each SVG uses SMIL animations (they also run when the file is used as <img>) and
exposes hooks for interaction when inlined in the page:
  - <g data-depth="..">  layers moved by the pointer (parallax, assets/js/site.js)
  - .n                    nodes, enlarged on hover (CSS)
Outputs: _includes/illo/<name>.svg (inline) + assets/img/<dir>/<name>.svg (file copy).
"""
import math, random, os, sys

ROOT = sys.argv[1]
W, H = 800, 350
NAVY, BLUE, TEAL, MAG, OCHRE, INK = "#00369f", "#1f4fd1", "#2f8586", "#a624a6", "#9a7a1e", "#142033"
LINE, BG, PAPER, GREY = "#c9c2b4", "#f6f4ef", "#ffffff", "#9aa3b2"
TINT = {NAVY: "#e3e9f7", BLUE: "#e5ecfb", TEAL: "#e0efef", MAG: "#f4e3f4", OCHRE: "#f3ecd9"}
R = lambda v: f"{v:.1f}"


# ---------------------------------------------------------------- primitives
def frame(name, body, accent, label):
    return (f'<svg class="illo illo--{name}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" aria-label="{label}">'
            f'<defs><pattern id="dots-{name}" width="26" height="26" patternUnits="userSpaceOnUse">'
            f'<circle cx="13" cy="13" r="1.1" fill="#e2ddd3"/></pattern></defs>'
            f'<rect width="{W}" height="{H}" fill="{BG}"/><rect width="{W}" height="{H}" fill="url(#dots-{name})"/>'
            f'{body}<rect x="0" y="{H-5}" width="{W}" height="5" fill="{accent}" opacity=".85"/></svg>')


def layer(depth, inner, float_y=0, dur=7, begin=0):
    anim = ""
    if float_y:
        anim = (f'<animateTransform attributeName="transform" type="translate" values="0 0;0 {-float_y};0 0" '
                f'dur="{dur}s" begin="{begin}s" repeatCount="indefinite" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"/>')
    return f'<g data-depth="{depth}"><g>{anim}{inner}</g></g>'


def node(x, y, r=7, fill=PAPER, stroke=INK, sw=1.6, cls="n"):
    return f'<circle class="{cls}" cx="{R(x)}" cy="{R(y)}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>'


def edge(x1, y1, x2, y2, c=LINE, w=1.6, dash=None, op=1, flow=False):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    a = (f'<animate attributeName="stroke-dashoffset" from="0" to="-18" dur="1.2s" repeatCount="indefinite"/>' if flow else "")
    return (f'<line x1="{R(x1)}" y1="{R(y1)}" x2="{R(x2)}" y2="{R(y2)}" stroke="{c}" stroke-width="{w}" '
            f'stroke-linecap="round" opacity="{op}"{d}>{a}</line>')


def signal(points, color, dur=2.4, begin=0, r=4):
    path = "M" + " L".join(f"{R(x)} {R(y)}" for x, y in points)
    return (f'<g opacity="0"><animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.12;.85;1" dur="{dur}s" begin="{begin}s" repeatCount="indefinite"/>'
            f'<circle r="{r*2.6}" fill="{color}" opacity=".18"/><circle r="{r}" fill="{color}"/>'
            f'<animateMotion dur="{dur}s" begin="{begin}s" repeatCount="indefinite" path="{path}" calcMode="spline" keyTimes="0;1" keySplines=".4 0 .6 1"/></g>')


def ripple(x, y, r0, color, dur=2.6, begin=0, grow=22, sw=2):
    return (f'<circle cx="{R(x)}" cy="{R(y)}" r="{r0}" fill="none" stroke="{color}" stroke-width="{sw}" opacity="0">'
            f'<animate attributeName="r" values="{r0};{r0+grow}" dur="{dur}s" begin="{begin}s" repeatCount="indefinite"/>'
            f'<animate attributeName="opacity" values=".7;0" dur="{dur}s" begin="{begin}s" repeatCount="indefinite"/></circle>')


def blink(inner, dur=3, begin=0, lo=.25):
    return (f'<g>{inner}<animate attributeName="opacity" values="{lo};1;{lo}" dur="{dur}s" begin="{begin}s" repeatCount="indefinite"/></g>')


def appear(inner, dur, t_on, t_off=.92, begin=0):
    """visible from fraction t_on to t_off of a loop of `dur` seconds"""
    return (f'<g opacity="0">{inner}<animate attributeName="opacity" values="0;0;1;1;0" '
            f'keyTimes="0;{t_on:.3f};{min(t_on+.06, t_off-.01):.3f};{t_off:.3f};1" dur="{dur}s" begin="{begin}s" repeatCount="indefinite"/></g>')


def cluster(cx, cy, n, rad, seed):
    rnd = random.Random(seed)
    return [(cx + rad * rnd.uniform(.45, 1) * math.cos(2 * math.pi * i / n + rnd.uniform(-.3, .3)),
             cy + rad * rnd.uniform(.45, 1) * math.sin(2 * math.pi * i / n + rnd.uniform(-.3, .3))) for i in range(n)]


def knn_edges(pts, k=2):
    es = set()
    for i, (x, y) in enumerate(pts):
        d = sorted((math.hypot(x - a, y - b), j) for j, (a, b) in enumerate(pts) if j != i)
        for _, j in d[:k]:
            es.add(tuple(sorted((i, j))))
    return sorted(es)


def nodes_of(pts, color, r=7, hub=0):
    s = ""
    for i, (x, y) in enumerate(pts):
        if i == hub:
            s += node(x, y, r + 3, color, color)
        elif i % 3 == 1:
            s += node(x, y, r, TINT.get(color, PAPER), color)
        else:
            s += node(x, y, r, PAPER, INK, 1.4)
    return s


def bubble(x, y, w, h, stroke=INK, fill=PAPER, tail="left", lines=2):
    t = (f'M{x+18},{y+h} l-6,12 l16,-12' if tail == "left" else f'M{x+w-26},{y+h} l10,12 l2,-12')
    s = (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{fill}" stroke="{stroke}" stroke-width="1.4"/>'
         f'<path d="{t}" fill="{fill}" stroke="{stroke}" stroke-width="1.4" stroke-linejoin="round"/>'
         f'<rect x="{x+12}" y="{y+h/2-1}" width="{w-24}" height="2" fill="{fill}"/>')
    for i in range(lines):
        lw = (w - 28) * (1 if i < lines - 1 else .6)
        s += f'<rect x="{x+14}" y="{y+12+i*11}" width="{lw:.0f}" height="5" rx="2.5" fill="{GREY}"/>'
    return s


def typing_dots(x, y, c):
    s = ""
    for i in range(3):
        s += (f'<circle cx="{x+i*11}" cy="{y}" r="3.5" fill="{c}"><animate attributeName="cy" values="{y};{y-5};{y}" '
              f'dur="1s" begin="{i*.15}s" repeatCount="indefinite"/></circle>')
    return s


def window(x, y, w, h):
    s = (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{PAPER}" stroke="{INK}" stroke-width="1.6"/>'
         f'<path d="M{x},{y+26} h{w}" stroke="{INK}" stroke-width="1.2" opacity=".5"/>')
    for i, c in enumerate([MAG, OCHRE, TEAL]):
        s += f'<circle cx="{x+16+i*14}" cy="{y+13}" r="4" fill="{c}"/>'
    return s


def typed_code(x, y, rows, colors, dur=9.0, step=17):
    """code lines that type in one after the other and reset"""
    s, n = "", len(rows)
    for i, (indent, segs) in enumerate(rows):
        cx = x + indent * 16
        t0 = .04 + .7 * i / n
        t1 = t0 + .7 / n
        for j, w in enumerate(segs):
            col = colors[(i + j) % len(colors)]
            s += (f'<rect x="{cx}" y="{y + i*step}" width="0" height="7" rx="3.5" fill="{col}" opacity=".88">'
                  f'<animate attributeName="width" values="0;0;{w};{w};0" keyTimes="0;{t0:.3f};{t1:.3f};.94;1" dur="{dur}s" repeatCount="indefinite"/></rect>')
            cx += w + 7
    return s


# ---------------------------------------------------------------- research lines
def r_genai():
    hubs = [(170, 180, MAG), (400, 118, NAVY), (630, 185, TEAL), (400, 262, OCHRE)]
    bg = ""
    for i in range(4):
        for j in range(i + 1, 4):
            bg += edge(hubs[i][0], hubs[i][1], hubs[j][0], hubs[j][1], LINE, 2)
    leaves = ""
    for (x, y, c) in hubs:
        for k in range(4):
            a = k * math.pi / 2 + .5
            lx, ly = x + 62 * math.cos(a), y + 50 * math.sin(a)
            leaves += edge(x, y, lx, ly) + node(lx, ly, 6)
    sig = (signal([hubs[0][:2], hubs[1][:2], hubs[2][:2]], MAG, 3.2, 0) + signal([hubs[2][:2], hubs[3][:2], hubs[0][:2]], TEAL, 3.2, 1.6)
           + signal([hubs[1][:2], hubs[3][:2]], NAVY, 2.2, .8))
    hx = ""
    for i, (x, y, c) in enumerate(hubs):
        hx += (f'<g class="n"><polygon points="{hexpts(x, y, 26)}" fill="{c}"/><polygon points="{hexpts(x, y, 34)}" fill="none" stroke="{c}" stroke-width="1.6">'
               f'<animateTransform attributeName="transform" type="rotate" from="0 {x} {y}" to="60 {x} {y}" dur="{6+i}s" repeatCount="indefinite"/></polygon>'
               f'<path d="M{x-9},{y-3} h18 M{x-9},{y+5} h11" stroke="#fff" stroke-width="3" stroke-linecap="round"/></g>')
    loop = 9
    chat = (appear(bubble(205, 68, 120, 44, MAG, PAPER, "left", 2), loop, .05) +
            appear(bubble(520, 58, 98, 36, NAVY, TINT[NAVY], "left", 1), loop, .3) +
            appear(bubble(470, 190, 120, 44, TEAL, PAPER, "right", 2), loop, .55) +
            appear(f'<rect x="268" y="238" width="62" height="30" rx="12" fill="{PAPER}" stroke="{OCHRE}" stroke-width="1.4"/>' + typing_dots(285, 253, OCHRE), loop, .7))
    body = layer(.3, bg + leaves) + layer(.6, sig + hx, 4, 8) + layer(1, chat, 6, 6)
    return body, MAG, "LLM agents interacting in a network"


def hexpts(x, y, r):
    return " ".join(f"{R(x + r*math.cos(math.pi/3*i + math.pi/6))},{R(y + r*math.sin(math.pi/3*i + math.pi/6))}" for i in range(6))


def r_netmod():
    planes = [(110, 240, NAVY), (110, 130, TEAL)]
    rnd = random.Random(3)
    lp = []
    for (x0, y0, c) in planes:
        lp.append([(x0 + 90 + i * 70 + rnd.uniform(-14, 14) + j * 40, y0 - 22 - j * 28 + rnd.uniform(-5, 5)) for i in range(5) for j in range(2)])
    inter = "".join(edge(a[0], a[1], b[0], b[1], INK, 1, "3 4", .45, flow=True) for a, b in zip(lp[0], lp[1]))
    layers = []
    for pts, (x0, y0, c) in zip(lp, planes):
        s = f'<path d="M{x0},{y0} L{x0+420},{y0} L{x0+520},{y0-70} L{x0+100},{y0-70} Z" fill="{TINT[c]}" stroke="{c}" stroke-width="1.6"/>'
        s += "".join(edge(*pts[a], *pts[b], INK, 1.3, None, .55) for a, b in knn_edges(pts, 2))
        s += "".join(node(x, y, 6.5, c if i % 4 == 0 else PAPER, c) for i, (x, y) in enumerate(pts))
        layers.append(s)
    p = lp[1]
    hyper = (f'<ellipse cx="{R((p[2][0]+p[4][0])/2)}" cy="{R((p[2][1]+p[4][1])/2-4)}" rx="70" ry="24" fill="{MAG}" fill-opacity=".16" stroke="{MAG}" stroke-width="1.4">'
             f'<animate attributeName="rx" values="66;76;66" dur="4s" repeatCount="indefinite"/></ellipse>')
    tags = "".join(f'<rect x="{R(x+10)}" y="{R(y-26)}" width="34" height="14" rx="7" fill="{c}"/>' for (x, y), c in [(p[7], OCHRE), (lp[0][3], MAG)])
    sig = signal([lp[0][0], lp[1][0], lp[1][2], lp[1][4], lp[0][4], lp[0][6]], MAG, 4, 0) + signal([lp[0][9], lp[1][9], lp[1][7]], TEAL, 3, 1.5)
    body = layer(.4, layers[0], 3, 7, 0) + layer(.6, inter) + layer(.9, layers[1] + hyper + tags, 7, 7, 3.5) + layer(.7, sig)
    return body, TEAL, "Multilayer and higher-order network"


def r_dynamics():
    axis = edge(70, 300, 740, 300, INK, 1.6) + f'<path d="M740,300 l-10,-6 v12 z" fill="{INK}"/>'
    base = cluster(0, 0, 7, 62, 9)
    cols = [NAVY, TEAL, MAG, OCHRE]
    rnd = random.Random(5)
    snaps, loop = "", 8
    for t in range(4):
        cx = 140 + t * 175
        axis += f'<line x1="{cx}" y1="294" x2="{cx}" y2="306" stroke="{INK}" stroke-width="1.6"/>'
        pts = [(cx + x * (1 + .05 * t) + rnd.uniform(-8, 8), 150 + y + rnd.uniform(-8, 8)) for x, y in base]
        es = knn_edges(pts, 2)
        if t % 2:
            es = es[:-1]
        if t >= 2:
            es.append((0, 4))
        s = f'<rect x="{cx-80}" y="40" width="160" height="220" rx="16" fill="{PAPER}" stroke="#ddd6c9"/>'
        # highlight frame sweeping across snapshots
        s += (f'<rect x="{cx-80}" y="40" width="160" height="220" rx="16" fill="none" stroke="{MAG}" stroke-width="2.4" opacity="0">'
              f'<animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="0;{t/4:.3f};{t/4+.03:.3f};{(t+1)/4-.03:.3f};{(t+1)/4:.3f};1" dur="{loop}s" repeatCount="indefinite"/></rect>')
        s += "".join(edge(*pts[a], *pts[b]) for a, b in es)
        for i, (x, y) in enumerate(pts):
            grp = cols[(i + t) % 2] if i < 4 else cols[2 + (t > 1)]
            s += node(x, y, 7, grp if i in (0, 4) else PAPER, grp)
        snaps += layer(.3 + .2 * t, s)
    marker = (f'<circle cy="300" r="7" fill="{MAG}"><animate attributeName="cx" values="140;315;490;665;665" keyTimes="0;.25;.5;.75;1" '
              f'dur="{loop}s" repeatCount="indefinite" calcMode="discrete"/></circle>')
    arrows = ""
    for t in range(3):
        x = 140 + t * 175 + 92
        arrows += f'<path d="M{x},150 q22,-18 44,0" fill="none" stroke="{MAG}" stroke-width="2" stroke-dasharray="4 4"><animate attributeName="stroke-dashoffset" from="0" to="-16" dur="1s" repeatCount="indefinite"/></path><path d="M{x+44},150 l-9,-3 l3,9 z" fill="{MAG}"/>'
    return layer(.2, axis + marker) + snaps + layer(1, arrows), NAVY, "Temporal network snapshots"


def r_debates():
    A = cluster(250, 170, 11, 95, 21)
    B = cluster(550, 170, 11, 95, 22)
    halo = (f'<circle cx="250" cy="170" r="122" fill="{TINT[NAVY]}"><animate attributeName="r" values="118;126;118" dur="5s" repeatCount="indefinite"/></circle>'
            f'<circle cx="550" cy="170" r="122" fill="{TINT[MAG]}"><animate attributeName="r" values="126;118;126" dur="5s" repeatCount="indefinite"/></circle>')
    net = ""
    for pts in (A, B):
        net += "".join(edge(*pts[a], *pts[b], INK, 1.2, None, .45) for a, b in knn_edges(pts, 3))
    bridges = "".join(blink(edge(*A[a], *B[b], OCHRE, 2, "5 5", 1, flow=True), 2.4, i * 1.2, .15) for i, (a, b) in enumerate([(1, 6), (3, 8)]))
    nn = nodes_of(A, NAVY) + nodes_of(B, MAG)
    echo = signal([A[0], A[3], A[6], A[9], A[0]], NAVY, 4, 0) + signal([B[0], B[4], B[8], B[2], B[0]], MAG, 4, 2)
    loop = 8
    chat = (appear(bubble(120, 30, 110, 40, NAVY, PAPER, "right", 2), loop, .05, .5) + appear(bubble(570, 30, 110, 40, MAG, PAPER, "left", 2), loop, .2, .65) +
            appear(bubble(120, 30, 110, 40, NAVY, TINT[NAVY], "right", 1), loop, .55) + appear(bubble(570, 30, 110, 40, MAG, TINT[MAG], "left", 1), loop, .7))
    warn = (f'<g transform="translate(386,40)"><circle r="16" cx="14" cy="14" fill="{OCHRE}"><animate attributeName="r" values="15;18;15" dur="1.6s" repeatCount="indefinite"/></circle>'
            f'<path d="M14,6 v10 M14,21 v1" stroke="#fff" stroke-width="3.4" stroke-linecap="round"/></g>')
    return layer(.2, halo) + layer(.5, net + bridges + echo + nn, 3, 6) + layer(1, chat + warn, 5, 7), NAVY, "Two polarized communities"


def r_wellbeing():
    cx, cy = 400, 175
    ring = [(cx + 150 * math.cos(2 * math.pi * i / 10), cy + 110 * math.sin(2 * math.pi * i / 10)) for i in range(10)]
    s = f'<ellipse cx="{cx}" cy="{cy}" rx="190" ry="140" fill="{TINT[TEAL]}"/>'
    s += ripple(cx, cy, 36, TEAL, 3, 0, 120, 2) + ripple(cx, cy, 36, TEAL, 3, 1.5, 120, 2)
    net = ""
    for i, (x, y) in enumerate(ring):
        net += edge(x, y, cx, cy, TEAL, 1.6, None, .6) + edge(x, y, *ring[(i + 1) % 10])
        if i % 3 == 0:
            net += edge(x, y, *ring[(i + 4) % 10], LINE, 1.2, "3 4")
    sig = "".join(signal([ring[i], (cx, cy)], [TEAL, MAG][i % 2], 2.2, i * .45) for i in range(0, 10, 2))
    sig += "".join(signal([(cx, cy), ring[i]], TEAL, 2.2, 1.1 + i * .45) for i in range(1, 10, 2))
    nn = "".join(node(x, y, 9, TEAL if i % 4 == 0 else PAPER, TEAL) for i, (x, y) in enumerate(ring))
    heart = (f'<circle cx="{cx}" cy="{cy}" r="34" fill="{PAPER}" stroke="{TEAL}" stroke-width="2"/>'
             f'<g transform="translate({cx} {cy})"><g><path d="M0,14 C-30,-4 -16,-26 0,-10 C16,-26 30,-4 0,14 Z" fill="{MAG}"/>'
             f'<animateTransform attributeName="transform" type="scale" values="1;1.2;1;1.1;1" keyTimes="0;.15;.3;.45;1" dur="1.4s" repeatCount="indefinite"/></g></g>')
    loop = 8
    chat = appear(bubble(560, 40, 120, 42, TEAL, PAPER, "left", 2), loop, .05) + appear(bubble(110, 230, 112, 42, MAG, PAPER, "right", 2), loop, .4)
    return layer(.25, s) + layer(.55, net + sig + nn) + layer(.8, heart) + layer(1, chat, 5, 6), TEAL, "Supportive online community"


def r_cognitive():
    words = [(400, 170, 110, NAVY), (230, 95, 80, TEAL), (590, 90, 92, MAG), (210, 250, 96, OCHRE),
             (600, 255, 84, TEAL), (400, 55, 70, OCHRE), (400, 290, 74, MAG), (110, 170, 62, NAVY), (690, 172, 66, NAVY)]
    e = ""
    for i in range(1, len(words)):
        e += edge(words[0][0], words[0][1], words[i][0], words[i][1], LINE, 2)
    for a, b in [(1, 5), (2, 5), (3, 6), (4, 6), (1, 7), (2, 8), (3, 7), (4, 8)]:
        e += edge(words[a][0], words[a][1], words[b][0], words[b][1], LINE, 1.4, "4 4", 1, flow=True)
    hyper = (f'<path d="M230,95 L400,55 L590,90" fill="none" stroke="{MAG}" stroke-width="10" stroke-linejoin="round" opacity=".14">'
             f'<animate attributeName="opacity" values=".08;.28;.08" dur="3s" repeatCount="indefinite"/></path>')
    loop = 7.2
    pills = ""
    order = [0, 1, 5, 2, 8, 4, 6, 3, 7]
    for k, i in enumerate(order):
        x, y, w, c = words[i]
        h = 34 if i == 0 else 28
        fill = c if i == 0 else PAPER
        pills += (f'<g class="n"><rect x="{x-w/2}" y="{y-h/2}" width="{w}" height="{h}" rx="{h/2}" fill="{fill}" stroke="{c}" stroke-width="1.8"/>'
                  f'<rect x="{x-w/2}" y="{y-h/2}" width="{w}" height="{h}" rx="{h/2}" fill="{c}" opacity="0">'
                  f'<animate attributeName="opacity" values="0;0;.85;0;0" keyTimes="0;{k/len(order)*.78:.3f};{k/len(order)*.78+.05:.3f};{k/len(order)*.78+.2:.3f};1" dur="{loop}s" repeatCount="indefinite"/></rect>'
                  f'<rect x="{x-w/2+14}" y="{y-3}" width="{w-28}" height="6" rx="3" fill="{"#ffffff" if i == 0 else TINT[c]}"/></g>')
    bars = ""
    for k, (v, c) in enumerate([(46, TEAL), (28, MAG), (36, OCHRE)]):
        bars += (f'<rect x="{700 + k*18}" y="{300 - v}" width="12" height="{v}" rx="3" fill="{c}" opacity=".8">'
                 f'<animate attributeName="height" values="{v};{v*.5};{v}" dur="{2.4+k*.5}s" repeatCount="indefinite"/>'
                 f'<animate attributeName="y" values="{300-v};{300-v*.5};{300-v}" dur="{2.4+k*.5}s" repeatCount="indefinite"/></rect>')
    return layer(.3, e + hyper) + layer(.8, pills, 4, 7) + layer(.5, bars), OCHRE, "Semantic network of word associations"


# ---------------------------------------------------------------- courses
def c_sna():
    groups = [(220, 165, NAVY, 31), (420, 115, TEAL, 32), (590, 200, MAG, 33)]
    allp = [cluster(x, y, 8, 80, sd) for (x, y, c, sd) in groups]
    halos = "".join(f'<circle cx="{x}" cy="{y}" r="98" fill="{TINT[c]}"><animate attributeName="r" values="94;102;94" dur="{5+i}s" repeatCount="indefinite"/></circle>' for i, (x, y, c, _) in enumerate(groups))
    bridges = "".join(edge(*allp[a[0]][a[1]], *allp[b[0]][b[1]], OCHRE, 2.2, "5 5", 1, True) for a, b in [((0, 2), (1, 5)), ((1, 3), (2, 6)), ((0, 5), (2, 1))])
    body = ""
    for i, (p, (x, y, c, _)) in enumerate(zip(allp, groups)):
        g = "".join(edge(*p[a], *p[b]) for a, b in knn_edges(p, 2)) + nodes_of(p, c)
        body += layer(.5 + .2 * i, g, 4, 6 + i, i)
    sig = signal([allp[0][0], allp[0][2], allp[1][5], allp[1][3], allp[2][6], allp[2][0]], OCHRE, 4.5, 0)
    return layer(.2, halos) + layer(.4, bridges) + body + layer(.9, sig), NAVY, "Communities in a social network"


def c_alns():
    pts = [(120, 120), (200, 80), (250, 160), (170, 210), (90, 230), (300, 250), (330, 120), (260, 290)]
    hyp = [((0, 1, 2), NAVY), ((2, 3, 5), MAG), ((3, 4, 7), TEAL), ((2, 6, 5), OCHRE)]
    g = ""
    for k, (idx, c) in enumerate(hyp):
        poly = " ".join(f"{pts[i][0]},{pts[i][1]}" for i in idx)
        g += (f'<polygon points="{poly}" fill="{c}" fill-opacity=".14" stroke="{c}" stroke-width="12" stroke-opacity=".14" stroke-linejoin="round">'
              f'<animate attributeName="fill-opacity" values=".06;.3;.06" dur="4s" begin="{k}s" repeatCount="indefinite"/></polygon>'
              f'<polygon points="{poly}" fill="none" stroke="{c}" stroke-width="1.6" stroke-linejoin="round"/>')
    g += "".join(node(x, y, 8, PAPER, INK) for x, y in pts)
    g += signal([pts[0], pts[2], pts[5], pts[7], pts[4]], MAG, 4, 0)
    win = window(430, 50, 320, 250)
    code = typed_code(452, 96, [(0, [40, 70]), (0, [60, 30, 50]), (1, [80, 40]), (1, [50, 90]), (0, [30]), (0, [70, 40]), (1, [100]), (1, [40, 60]), (0, [90])], [NAVY, TEAL, MAG, GREY])
    cursor = f'<rect x="452" y="256" width="9" height="16" fill="{INK}"><animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" calcMode="discrete"/></rect>'
    arrow = f'<path d="M360,175 h46" stroke="{INK}" stroke-width="1.8" stroke-dasharray="4 4"><animate attributeName="stroke-dashoffset" from="0" to="-16" dur="1s" repeatCount="indefinite"/></path><path d="M410,175 l-10,-6 v12 z" fill="{INK}"/>'
    return layer(.8, g, 5, 7) + layer(.3, arrow) + layer(.5, win + code + cursor), MAG, "Hypergraph and code notebook"


def c_cna():
    panel = f'<rect x="420" y="40" width="330" height="260" rx="14" fill="{PAPER}" stroke="#ddd6c9"/>' + edge(460, 270, 730, 270, INK, 1.6) + edge(460, 270, 460, 60, INK, 1.6)
    loop = 6
    for i in range(14):
        x, y = 475 + i * 18, min(80 + (i ** 1.25) * 11, 262)
        t0 = .05 + i * .045
        panel += (f'<circle cx="{x}" cy="{R(y)}" r="5" fill="{BLUE}" opacity="0"><animate attributeName="opacity" values="0;0;.9;.9;0" keyTimes="0;{t0:.3f};{t0+.04:.3f};.92;1" dur="{loop}s" repeatCount="indefinite"/></circle>')
    panel += (f'<path d="M470,74 L735,262" stroke="{MAG}" stroke-width="2" stroke-dasharray="6 5" pathLength="1"><animate attributeName="stroke-dasharray" values="0 1;0 1;1 0;1 0" keyTimes="0;.7;.85;1" dur="{loop}s" repeatCount="indefinite"/></path>')
    rnd = random.Random(8)
    hub = (210, 175)
    leaves = [(hub[0] + r * math.cos(a), hub[1] + r * .8 * math.sin(a)) for a, r in ((2 * math.pi * i / 16 + rnd.uniform(-.1, .1), rnd.uniform(70, 140)) for i in range(16))]
    s = "".join(edge(*hub, x, y) for x, y in leaves)
    s += "".join(edge(*leaves[i], *leaves[(i + 1) % 16]) for i in range(0, 16, 3))
    s += "".join(signal([hub, leaves[i]], NAVY, 1.8, i * .25, 3) for i in range(0, 16, 2))
    s += "".join(node(x, y, 6, TINT[NAVY] if i % 4 else PAPER, NAVY) for i, (x, y) in enumerate(leaves))
    s += ripple(*hub, 16, NAVY, 2, 0, 30) + node(*hub, 16, NAVY, NAVY)
    return layer(.8, s, 4, 7) + layer(.4, panel), BLUE, "Hub network and degree distribution"


def c_epi():
    rnd = random.Random(12)
    pts = [(70 + (i % 10) * 72 + rnd.uniform(-18, 18), 70 + (i // 10) * 75 + rnd.uniform(-14, 14)) for i in range(40)]
    s = "".join(edge(*pts[a], *pts[b]) for a, b in knn_edges(pts, 2))
    c0 = pts[23]
    loop = 7
    s += "".join(ripple(*c0, 10, MAG, loop, k * 2.3, 230, 2) for k in range(3))
    nn = ""
    for (x, y) in pts:
        d = math.hypot(x - c0[0], y - c0[1])
        t_inf = min(.85, d / 420)          # infection front
        t_rec = min(.95, t_inf + .3)        # recovery
        nn += (f'<circle class="n" cx="{R(x)}" cy="{R(y)}" r="8" stroke-width="1.8">'
               f'<animate attributeName="fill" values="{PAPER};{PAPER};{MAG};{TEAL};{TEAL};{PAPER}" keyTimes="0;{t_inf:.3f};{min(t_inf+.03, .97):.3f};{t_rec:.3f};.97;1" dur="{loop}s" repeatCount="indefinite"/>'
               f'<animate attributeName="stroke" values="{NAVY};{NAVY};{MAG};{TEAL};{TEAL};{NAVY}" keyTimes="0;{t_inf:.3f};{min(t_inf+.03, .97):.3f};{t_rec:.3f};.97;1" dur="{loop}s" repeatCount="indefinite"/></circle>')
    legend = "".join(f'<circle cx="{650 + k*34}" cy="320" r="8" fill="{f}" stroke="{c}" stroke-width="1.8"/>' for k, (c, f) in enumerate([(NAVY, PAPER), (MAG, MAG), (TEAL, TEAL)]))
    return layer(.4, s) + layer(.7, nn) + layer(.2, legend), MAG, "SIR epidemic spreading on a network"


def c_pkg():
    x, y = 300, 120
    box = (f'<path d="M{x},{y} L{x+100},{y-50} L{x+200},{y} L{x+100},{y+50} Z" fill="{TINT[OCHRE]}" stroke="{OCHRE}" stroke-width="2"/>'
           f'<path d="M{x},{y} L{x},{y+120} L{x+100},{y+170} L{x+100},{y+50} Z" fill="{PAPER}" stroke="{OCHRE}" stroke-width="2"/>'
           f'<path d="M{x+200},{y} L{x+200},{y+120} L{x+100},{y+170} L{x+100},{y+50} Z" fill="#efe6cf" stroke="{OCHRE}" stroke-width="2"/>'
           f'<path d="M{x+50},{y-25} L{x+150},{y+25} L{x+150},{y+80}" fill="none" stroke="{OCHRE}" stroke-width="10" opacity=".35"/>'
           f'<path d="M{x+30},{y+98} l-14,13 l14,13 M{x+56},{y+92} l-10,38 M{x+70},{y+108} l14,13 l-14,13" stroke="{INK}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round" transform="skewY(26.565) translate(0,-{(x+50)*0.5:.0f})"/>')
    files, flights = "", ""
    for k, (fx, fy, c) in enumerate([(120, 80, NAVY), (130, 190, TEAL), (610, 90, MAG), (600, 200, NAVY)]):
        files += (f'<g class="n"><path d="M{fx},{fy} h44 l14,14 v46 h-58 Z" fill="{PAPER}" stroke="{c}" stroke-width="1.8"/>'
                  f'<rect x="{fx+10}" y="{fy+24}" width="34" height="5" rx="2.5" fill="{c}" opacity=".6"/><rect x="{fx+10}" y="{fy+36}" width="24" height="5" rx="2.5" fill="{c}" opacity=".6"/></g>')
        sx = fx + (66 if fx < 400 else -8)
        tx = x + 40 if fx < 400 else x + 160
        flights += edge(sx, fy + 30, tx, y + 60, c, 1.6, "4 5", .8, True)
        flights += signal([(sx, fy + 30), (tx, y + 60)], c, 2.4, k * .6, 4)
    bar = (f'<rect x="300" y="305" width="200" height="22" rx="11" fill="{INK}"/>'
           f'<rect x="316" y="313" width="0" height="6" rx="3" fill="{OCHRE}"><animate attributeName="width" values="0;168;168;0" keyTimes="0;.8;.95;1" dur="4s" repeatCount="indefinite"/></rect>')
    bounce = f'<animateTransform attributeName="transform" type="translate" values="0 0;0 -4;0 0" dur="2.4s" repeatCount="indefinite"/>'
    return layer(.4, flights) + layer(.7, f'<g>{bounce}{box}</g>') + layer(1, files, 5, 6) + layer(.3, bar), OCHRE, "Building and publishing a Python package"


def c_pds():
    tbl = f'<rect x="60" y="45" width="300" height="250" rx="14" fill="{PAPER}" stroke="#ddd6c9"/>'
    for r in range(7):
        y = 70 + r * 32
        tbl += f'<path d="M80,{y+22} h260" stroke="#e7e2d8" stroke-width="1.2"/>'
        for c, w in enumerate([50, 80, 60]):
            col = [NAVY, TEAL, OCHRE][c] if r == 0 else "#b9c0cc"
            tbl += f'<rect x="{90 + c*85}" y="{y+6}" width="{w}" height="7" rx="3.5" fill="{col}"/>'
    # scanning highlight row
    tbl += (f'<rect x="72" y="100" width="276" height="26" rx="6" fill="{TEAL}" opacity=".12">'
            f'<animate attributeName="y" values="100;132;164;196;228;260;100" dur="6s" repeatCount="indefinite" calcMode="discrete"/></rect>')
    ch = f'<rect x="420" y="45" width="320" height="250" rx="14" fill="{PAPER}" stroke="#ddd6c9"/>' + edge(450, 265, 720, 265, INK, 1.4) + edge(450, 265, 450, 70, INK, 1.4)
    vals = [90, 140, 115, 175, 150]
    for k, v in enumerate(vals):
        v2 = [60, 110, 150, 130, 170][k]
        ch += (f'<rect x="{470 + k*48}" y="{265 - v}" width="30" height="{v}" rx="5" fill="{[NAVY, TEAL, MAG, NAVY, OCHRE][k]}" opacity=".85">'
               f'<animate attributeName="height" values="{v};{v2};{v}" dur="6s" repeatCount="indefinite" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"/>'
               f'<animate attributeName="y" values="{265-v};{265-v2};{265-v}" dur="6s" repeatCount="indefinite" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"/></rect>')
    line_a = "M485,170 L533,128 L581,150 L629,95 L677,112"
    line_b = "M485,200 L533,150 L581,112 L629,130 L677,90"
    ch += (f'<path d="{line_a}" fill="none" stroke="{INK}" stroke-width="2.2"><animate attributeName="d" values="{line_a};{line_b};{line_a}" dur="6s" repeatCount="indefinite"/></path>')
    arrow = f'<path d="M370,170 h40" stroke="{INK}" stroke-width="1.8" stroke-dasharray="4 4"><animate attributeName="stroke-dashoffset" from="0" to="-16" dur="1s" repeatCount="indefinite"/></path><path d="M414,170 l-10,-6 v12 z" fill="{INK}"/>'
    return layer(.5, tbl, 3, 7) + layer(.3, arrow) + layer(.8, ch, 3, 7, 3.5), TEAL, "From a data table to charts"


def c_intro():
    win = window(150, 40, 500, 260)
    code = typed_code(176, 96, [(0, [60, 90]), (1, [40, 120]), (2, [70, 50, 40]), (2, [100]), (1, [50]), (0, [30, 60]), (1, [140]), (1, [80, 50]), (0, [40])], [NAVY, MAG, TEAL, OCHRE, GREY])
    cursor = f'<rect x="176" y="258" width="10" height="18" fill="{INK}"><animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" calcMode="discrete"/></rect>'
    check = (f'<g transform="translate(560,210)" opacity="0"><animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;.78;.82;.94;1" dur="9s" repeatCount="indefinite"/>'
             f'<circle r="30" cx="30" cy="30" fill="{TINT[TEAL]}" stroke="{TEAL}" stroke-width="2"/><path d="M18,31 l9,9 l17,-19" stroke="{TEAL}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>')
    return layer(.5, win + code + cursor, 3, 8) + layer(1, check), NAVY, "Writing a first program"


def r_llmod():
    """LLM agents debating on a network (left) + opinion trajectories drifting into clusters (right)"""
    loop = 10
    rnd = random.Random(7)
    pal = [NAVY, BLUE, TEAL, OCHRE, MAG]
    # --- agent network
    cx, cy = 215, 178
    pts = [(cx + 120 * math.cos(2 * math.pi * i / 9 - .3), cy + 105 * math.sin(2 * math.pi * i / 9 - .3)) for i in range(9)] + [(cx - 20, cy - 10), (cx + 35, cy + 30)]
    es = knn_edges(pts, 3)
    net = "".join(edge(*pts[a], *pts[b], INK, 1.2, None, .4) for a, b in es)
    talk = "".join(blink(edge(*pts[a], *pts[b], MAG, 2.2, "5 5", 1, flow=True), 2.6, i * .9, .0)
                   for i, (a, b) in enumerate(es[::4][:4]))
    ag = ""
    for i, (x, y) in enumerate(pts):
        start = pal[i % 5]
        end = NAVY if (i % 5) in (0, 1) or i == 9 else (MAG if (i % 5) in (3, 4) else TEAL)
        ag += (f'<g class="n"><polygon points="{hexpts(x, y, 14)}" fill="{start}" stroke="#fff" stroke-width="2">'
               f'<animate attributeName="fill" values="{start};{start};{end};{end};{start}" keyTimes="0;.15;.6;.92;1" dur="{loop}s" repeatCount="indefinite"/></polygon>'
               f'<path d="M{R(x-5)},{R(y-2)} h10 M{R(x-5)},{R(y+3)} h6" stroke="#fff" stroke-width="2" stroke-linecap="round"/></g>')
    chat = (appear(bubble(70, 26, 104, 38, NAVY, PAPER, "right", 2), loop, .05, .45) +
            appear(bubble(250, 22, 96, 34, MAG, TINT[MAG], "left", 1), loop, .3, .7) +
            appear(f'<rect x="300" y="262" width="62" height="30" rx="12" fill="{PAPER}" stroke="{TEAL}" stroke-width="1.4"/>' + typing_dots(317, 277, TEAL), loop, .5))
    # --- opinion trajectories panel
    px, py, pw, ph = 440, 50, 310, 240
    panel = (f'<rect x="{px}" y="{py}" width="{pw}" height="{ph}" rx="14" fill="{PAPER}" stroke="{INK}" stroke-width="1.4"/>'
             f'<path d="M{px+30},{py+20} v{ph-50} h{pw-50}" fill="none" stroke="{INK}" stroke-width="1.4" opacity=".6"/>'
             f'<path d="M{px+pw-28},{py+ph-34} l8,4 l-8,4" fill="none" stroke="{INK}" stroke-width="1.4" opacity=".6"/>')
    for k in range(1, 4):
        yy = py + 20 + k * (ph - 50) / 4
        panel += f'<line x1="{px+30}" y1="{R(yy)}" x2="{px+pw-20}" y2="{R(yy)}" stroke="{LINE}" stroke-width="1" stroke-dasharray="3 5"/>'
    x0, x1 = px + 34, px + pw - 26
    top, bot = py + 26, py + ph - 36
    targets = [(.18, NAVY), (.24, NAVY), (.55, TEAL), (.82, MAG), (.88, MAG)]
    traj = ""
    for i in range(14):
        o0 = rnd.uniform(.03, .97)
        tg, col = min(targets, key=lambda t: abs(t[0] - o0))
        tg += rnd.uniform(-.03, .03) - .05  # agreement drift
        d = f"M{R(x0)},{R(top + (bot-top)*o0)}"
        n = 18
        o = o0
        for s_ in range(1, n + 1):
            o = o + (tg - o) * .28 + rnd.uniform(-.025, .025) * (1 - s_ / n)
            d += f" L{R(x0 + (x1-x0)*s_/n)},{R(top + (bot-top)*o)}"
        traj += (f'<path d="{d}" fill="none" stroke="{col}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity=".8" '
                 f'pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1">'
                 f'<animate attributeName="stroke-dashoffset" values="1;1;0;0;1" keyTimes="0;.1;.75;.95;1" dur="{loop}s" repeatCount="indefinite"/></path>')
    label = (f'<text x="{px+30}" y="{py+ph-12}" font-family="Inter, sans-serif" font-size="12" fill="{INK}" opacity=".6">time</text>'
             f'<text x="{px+12}" y="{py+ph/2}" font-family="Inter, sans-serif" font-size="12" fill="{INK}" opacity=".6" transform="rotate(-90 {px+12} {py+ph/2})" text-anchor="middle">opinion</text>')
    body = layer(.4, net + talk + ag, 4, 7) + layer(.8, panel + traj + label, 3, 8, 1) + layer(1, chat, 5, 6)
    return body, MAG, "LLM agents converging into opinion clusters"


FILES = {
    ("research", "genai"): r_genai, ("research", "netmod"): r_netmod, ("research", "dynamics"): r_dynamics,
    ("research", "debates"): r_debates, ("research", "wellbeing"): r_wellbeing, ("research", "cognitive"): r_cognitive, ("research", "llm-opinion"): r_llmod,
    ("teaching", "sna"): c_sna, ("teaching", "alns"): c_alns, ("teaching", "cna"): c_cna,
    ("teaching", "epidemics"): c_epi, ("teaching", "packaging"): c_pkg, ("teaching", "pds"): c_pds,
    ("teaching", "intro-programming"): c_intro,
}
for (d, name), fn in FILES.items():
    body, accent, label = fn()
    svg = frame(f"{d}-{name}", body, accent, label)
    for path in (os.path.join(ROOT, "_includes", "illo", f"{d}-{name}.svg"), os.path.join(ROOT, "assets", "img", d, f"{name}.svg")):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        open(path, "w").write(svg)
print("ok", len(FILES))
