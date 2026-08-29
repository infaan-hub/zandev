import os
import json
import urllib.request
import urllib.error

ORIGINKIT_API_KEY = os.environ.get('ORIGINKIT_API_KEY', 'cmp_live_qNqfwhTLBNdBtMjodqiIg57aBJEHVby5')
ORIGINKIT_MCP_URL = 'https://mcp.originkit.dev/mcp'


def _mcp_call(method, params=None):
    """Make a JSON-RPC 2.0 call to Originkit MCP server."""
    payload = {
        "jsonrpc": "2.0",
        "id": 1,
        "method": method,
        "params": params or {},
    }
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {ORIGINKIT_API_KEY}',
    }
    try:
        data = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(ORIGINKIT_MCP_URL, data=data, headers=headers, method='POST')
        with urllib.request.urlopen(req, timeout=30) as resp:
            result = json.loads(resp.read().decode('utf-8'))
            return result.get('result', result)
    except Exception as e:
        return {'error': str(e)}


def list_originkit_components(category=None):
    """List all Originkit components (no API key needed, no quota cost)."""
    params = {}
    if category:
        params['category'] = category
    return _mcp_call('tools/call', {
        'name': 'list_components',
        'arguments': params,
    })


def search_originkit(query):
    """Search Originkit components (no API key needed, no quota cost)."""
    return _mcp_call('tools/call', {
        'name': 'search',
        'arguments': {'query': query},
    })


def get_originkit_component(name, stack='react', styling='tailwind', typescript=True):
    """Fetch Originkit component source code (needs API key, costs 1 quota)."""
    return _mcp_call('tools/call', {
        'name': 'get_component',
        'arguments': {
            'name': name,
            'stack': stack,
            'styling': styling,
            'typescript': typescript,
        },
    })


# Pre-built catalog from Originkit (no API calls needed)
ORIGINKIT_CATALOG = [
    {"name": "blackhole", "displayName": "Black Hole", "category": "interactive-elements", "description": "Physically convincing 3D black hole with orbiting particles, depth-sorted occlusion, gravity inflow, and glowing event-horizon core.", "tags": ["3d", "particles", "canvas", "physics"]},
    {"name": "juiceeffect", "displayName": "Juice Effect", "category": "interactive-elements", "description": "Fill an image silhouette with gooey, rising-and-falling liquid particles that fuse into organic blobs and scatter from the cursor.", "tags": ["canvas", "particles", "liquid", "hover"]},
    {"name": "spiralimages", "displayName": "Spiral Images", "category": "image-gallery", "description": "Images flow along an Archimedean spiral vortex from the edge into the center, rotating to follow the tangent.", "tags": ["image", "gallery", "spiral", "rotation"]},
    {"name": "svgparticles", "displayName": "SVG Particle", "category": "interactive-elements", "description": "Transform images/SVGs into interactive particle animations with hover and repulsion effects.", "tags": ["particle", "image", "interactive", "hover"]},
    {"name": "fluidtrail", "displayName": "Fluid Trail", "category": "interactive-elements", "description": "Paint a glowing, GPU-simulated fluid trail that swirls and drifts behind the cursor with real Navier-Stokes physics.", "tags": ["webgl", "fluid", "canvas", "physics"]},
    {"name": "weight-hover", "displayName": "Weight Hover", "category": "text", "description": "Morph each letter's variable-font weight on hover, staggered letter-by-letter with a spring that eases in and out.", "tags": ["text", "hover", "variable font", "typography"]},
    {"name": "smokytext", "displayName": "Smoky Text", "category": "text", "description": "Animate text with realistic smoke diffusion, customizable reveal directions, trigger modes, and smooth character-based transitions.", "tags": ["text animation", "smoke effect", "typography", "reveal"]},
    {"name": "infinitegallery", "displayName": "Infinity Canvas", "category": "image-gallery", "description": "An infinitely zoomable and draggable image gallery with smooth motion, momentum, and immersive navigation.", "tags": ["gallery", "infinite", "zoom", "draggable"]},
    {"name": "pixelreveal", "displayName": "Pixel Reveal", "category": "animation", "description": "Dissolve a grid of colored pixel squares to reveal an image, sweeping up, down, left, or right with a ragged, noisy leading edge.", "tags": ["image", "canvas", "reveal", "dissolve"]},
    {"name": "inkbleed", "displayName": "Inkbleed", "category": "text", "description": "Create interactive ink bleed effects that react fluidly to cursor movement.", "tags": ["text effect", "ink bleed", "liquid text", "cursor"]},
    {"name": "glitterwrap", "displayName": "Glitter Wrap", "category": "animation", "description": "Send a glittering starfield of particles warping outward or inward from center, with random sparkle flashes.", "tags": ["canvas", "starfield", "particles", "warp"]},
    {"name": "risinglines", "displayName": "Rising Lines", "category": "animation", "description": "Emit two layers of glowing particles — thin line sparks and soft blobs — rising or falling from a luminous horizon.", "tags": ["canvas", "particles", "animation", "glow"]},
    {"name": "particlesphere", "displayName": "Particle Sphere", "category": "interactive-elements", "description": "Spin an interactive 3D sphere of thousands of glowing particles that scatter away from your cursor.", "tags": ["3d", "particles", "webgl", "sphere"]},
    {"name": "pixelcard", "displayName": "Pixel Card", "category": "background-animation", "description": "Fill a card with a shimmering canvas grid of pixels that grow in from the center or any edge on hover.", "tags": ["canvas", "pixels", "grid", "shimmer"]},
    {"name": "kineticgrid", "displayName": "Kinetic Grid", "category": "interactive-elements", "description": "An interactive grid background that dynamically reacts to cursor movement with smooth attraction and animated mesh lines.", "tags": ["background", "grid", "kinetic", "interactive"]},
    {"name": "typewriter", "displayName": "Type Writer", "category": "text", "description": "Types out a rotating list of phrases one character at a time with a blinking cursor.", "tags": ["text", "typewriter", "typing", "cursor"]},
    {"name": "random-letter-swap", "displayName": "Random Letter Swap", "category": "text", "description": "Swap each letter of a heading vertically on hover, revealing a duplicate glyph in a randomized, staggered order.", "tags": ["text", "hover", "animation", "stagger"]},
    {"name": "spinimage", "displayName": "Spin Image", "category": "image-gallery", "description": "Orbit a set of images along a tilted 3D ellipse with continuous spin, depth-based scaling, and front-to-back layering.", "tags": ["image", "gallery", "orbit", "3d"]},
    {"name": "textmorph", "displayName": "Text Morph", "category": "text", "description": "Cycle through a word list with a gooey blur-and-scale morph that melts each word smoothly into the next.", "tags": ["text", "morph", "blur", "animation"]},
    {"name": "draggable-grid", "displayName": "Draggable Grid", "category": "image-gallery", "description": "An infinitely draggable image canvas with smooth momentum, responsive layouts, and seamless gallery exploration.", "tags": ["infinite", "canvas", "gallery", "draggable"]},
    {"name": "usercursor", "displayName": "User Cursor", "category": "interactive-elements", "description": "Replace the native pointer inside any surface with a spring-tracked arrow and a trailing name pill.", "tags": ["cursor", "pointer", "follower", "spring"]},
    {"name": "boxcarousel", "displayName": "Box Carousel", "category": "image-gallery", "description": "Rotate images and videos across the four faces of a 3D cube, driven by autoplay, drag, or arrow keys.", "tags": ["3d", "cube", "carousel", "css"]},
    {"name": "pixeldrift", "displayName": "Pixel Drift", "category": "interactive-elements", "description": "Interactive particle typography that assembles, disperses, and reacts to cursor movement with smooth physics.", "tags": ["particle", "text", "typography", "interactive"]},
    {"name": "spotlighttext", "displayName": "Spotlight Text", "category": "text", "description": "Dim a block of text and sweep a soft cursor-following spotlight across it to reveal the bright letters.", "tags": ["text", "spotlight", "hover", "mask"]},
    {"name": "coverflowgallery", "displayName": "Coverflow Gallery", "category": "image-gallery", "description": "A smooth 3D coverflow carousel with perspective animations, autoplay, and fully customizable titles.", "tags": ["coverflow", "carousel", "3d", "slider"]},
    {"name": "coverflowcarousel", "displayName": "Coverflow Carousel", "category": "image-gallery", "description": "Glide through an infinite cover-flow reel where the centered image grows into a landscape hero.", "tags": ["image", "carousel", "coverflow", "gallery"]},
    {"name": "swipe-stack", "displayName": "Swipe Stack", "category": "image-gallery", "description": "Flick through a fanned 3D stack of image cards that tilt, scale, and cycle to the back on every swipe.", "tags": ["image", "cards", "swipe", "drag"]},
    {"name": "scrambletext", "displayName": "Scramble Text", "category": "text", "description": "Animate text with cinematic glitch reveals and interactive character-based hover effects.", "tags": ["text animation", "glitch", "character reveal", "hover"]},
    {"name": "emojiburst", "displayName": "Emoji Burst", "category": "button", "description": "Launch a burst of custom emojis from a tappable button, flying off freely under gravity.", "tags": ["emoji", "button", "particles", "physics"]},
    {"name": "snowfall", "displayName": "Snow Fall", "category": "background-animation", "description": "Fill any frame with drifting canvas snow, tuning per-flake size, speed, opacity, wind sway.", "tags": ["snow", "canvas", "particles", "background"]},
    {"name": "sticker-peel", "displayName": "Sticker Peel", "category": "interactive-elements", "description": "Peel and curl a 3D image sticker away from the surface on hover and press.", "tags": ["3d", "webgl", "image", "sticker"]},
    {"name": "blinkingsquares", "displayName": "Blinking Squares", "category": "background-animation", "description": "Fill any background with a grid of independently twinkling squares with a cursor-following halo.", "tags": ["canvas", "grid", "squares", "twinkle"]},
    {"name": "directionhover", "displayName": "Direction Hover", "category": "text", "description": "Swap text to an accent-colored copy that slides in from the top or bottom edge the cursor enters.", "tags": ["text", "hover", "direction-aware", "slide"]},
    {"name": "draggablesticker", "displayName": "Draggable Sticker", "category": "interactive-elements", "description": "Drag an image around like a real sticker that peels off the surface and tilts to your motion.", "tags": ["image", "sticker", "webgl", "drag"]},
    {"name": "starburst", "displayName": "Star Burst", "category": "animation", "description": "Radiate glowing streaks outward from a movable focal point to form a twinkling starburst.", "tags": ["canvas", "particles", "animation", "glow"]},
    {"name": "imagegallery", "displayName": "Image Gallery", "category": "image-gallery", "description": "Continuously stream images that fly outward or spiral from the center with configurable density.", "tags": ["image", "gallery", "spiral", "radial"]},
    {"name": "meshtexthover", "displayName": "Mesh Text Hover", "category": "text", "description": "Warp text across a WebGL mesh that drags and springs back under the cursor with chromatic fringes.", "tags": ["text", "webgl", "mesh", "hover"]},
    {"name": "character-waves", "displayName": "Character Waves", "category": "background-animation", "description": "Fill any background with a flowing field of ASCII characters driven by layered noise waves.", "tags": ["ascii", "canvas", "background", "noise"]},
    {"name": "gravitygallery", "displayName": "Gravity Gallery", "category": "interactive-elements", "description": "Drop image-filled squares into a Matter.js physics world with gravity and click-drag tossing.", "tags": ["image", "physics", "gallery", "drag"]},
    {"name": "blurcarousel", "displayName": "Blur Carousel", "category": "image-gallery", "description": "Flip through images with a soft blur that creeps in on arrow hover and a 3D press-tilt.", "tags": ["image", "carousel", "blur", "3d"]},
    {"name": "dynamic-weight", "displayName": "Dynamic Weight", "category": "text", "description": "Morph each letter between two font weights based on its distance from the cursor.", "tags": ["text", "typography", "variable font", "cursor"]},
    {"name": "flickertext", "displayName": "Flicker Text", "category": "text", "description": "Bring text and images to life with customizable flicker and outline effects.", "tags": ["text animation", "flicker effect", "outline text", "hover"]},
    {"name": "link-preview", "displayName": "Link Preview", "category": "button", "description": "Reveal a floating thumbnail of any linked page on hover, with the preview leaning toward your cursor.", "tags": ["text", "link", "hover", "preview"]},
    {"name": "magneticcarousel", "displayName": "Magnetic Carousel", "category": "image-gallery", "description": "Magnify a row of image bars macOS dock style as the cursor nears, then click to expand.", "tags": ["image", "gallery", "carousel", "dock"]},
    {"name": "particletunnel", "displayName": "Particle Tunnel", "category": "animation", "description": "Flow particles along radial spokes toward a central black void with perspective depth.", "tags": ["canvas", "3d", "particles", "tunnel"]},
    {"name": "shiny-pill", "displayName": "Shiny Pill", "category": "text", "description": "Sweep a bright sheen across a line of text on an endless loop with tunable shine color.", "tags": ["text", "shine", "gradient", "mask"]},
    {"name": "pixelate-image", "displayName": "Pixelate Image", "category": "interactive-elements", "description": "Reveal or conceal an image through a real-time SVG pixelation filter driven by cursor distance.", "tags": ["image", "svg", "pixelate", "hover"]},
    {"name": "proximityorbit", "displayName": "Proximity Orbit", "category": "image-gallery", "description": "Display images in a smooth, interactive circular orbit.", "tags": ["orbit", "gallery", "image animation", "hover"]},
    {"name": "textpath", "displayName": "Text Path", "category": "text", "description": "Scroll repeating text seamlessly along a procedural sine-wave path.", "tags": ["text", "svg", "marquee", "wave"]},
    {"name": "textlift", "displayName": "Text Lift", "category": "text", "description": "Stack each letter into a layered 3D extrusion that expands and lifts off on hover.", "tags": ["text", "hover", "3d", "extrusion"]},
]

# Category display names
CATEGORY_MAP = {
    'interactive-elements': 'Interactive',
    'image-gallery': 'Gallery',
    'text': 'Text',
    'animation': 'Animation',
    'background-animation': 'Background',
    'button': 'Button',
}
