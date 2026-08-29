import django, os
os.environ['DJANGO_SETTINGS_MODULE'] = 'zda.settings'
django.setup()
from designs_app.models import Design

designs_data = [
    {'name': 'SaaS Landing Page', 'category': 'Landing', 'framework': 'React', 'price': 'Free', 'score': 98, 'views': 48200, 'exports': 12100, 'preview_image': 'https://images.mixkit.co/cover-images/mixkit-photographer-portrait-2458-large.jpg', 'description': 'A modern SaaS landing page with hero section, features grid, pricing table, and FAQ accordion.'},
    {'name': 'Dashboard Pro', 'category': 'Dashboard', 'framework': 'Next.js', 'price': '$19', 'score': 96, 'views': 35800, 'exports': 9400, 'preview_image': 'https://images.mixkit.co/cover-images/mixkit-vector-gradient-buttons-2199-large.jpg', 'description': 'Full admin dashboard with sidebar navigation, charts, data tables, and settings panel.'},
    {'name': 'E-Commerce Kit', 'category': 'E-Commerce', 'framework': 'React', 'price': '$19', 'score': 95, 'views': 28100, 'exports': 7200, 'preview_image': 'https://images.mixkit.co/cover-images/mixkit-photographer-portrait-2458-large.jpg', 'description': 'Complete e-commerce UI kit with product cards, cart, checkout, and order confirmation.'},
    {'name': 'Portfolio Starter', 'category': 'Portfolio', 'framework': 'Vue', 'price': 'Free', 'score': 93, 'views': 22600, 'exports': 5800, 'preview_image': 'https://images.mixkit.co/cover-images/mixkit-vector-gradient-buttons-2199-large.jpg', 'description': 'Clean portfolio template with project gallery, about section, and contact form.'},
    {'name': 'Blog Template', 'category': 'Blog', 'framework': 'Astro', 'price': 'Free', 'score': 92, 'views': 18300, 'exports': 4100, 'preview_image': 'https://images.mixkit.co/cover-images/mixkit-photographer-portrait-2458-large.jpg', 'description': 'Minimal blog template with MDX support, dark mode, and RSS feed.'},
    {'name': 'Admin Panel', 'category': 'Admin', 'framework': 'React', 'price': '$19', 'score': 91, 'views': 15200, 'exports': 3800, 'preview_image': 'https://images.mixkit.co/cover-images/mixkit-vector-gradient-buttons-2199-large.jpg', 'description': 'Enterprise admin panel with role-based access, audit logs, and analytics dashboard.'},
    {'name': 'Mobile App UI', 'category': 'Mobile', 'framework': 'React Native', 'price': '$29', 'score': 90, 'views': 12800, 'exports': 2900, 'preview_image': 'https://images.mixkit.co/cover-images/mixkit-photographer-portrait-2458-large.jpg', 'description': 'Cross-platform mobile UI kit with 50+ screens and navigation patterns.'},
    {'name': 'Pricing Page', 'category': 'Landing', 'framework': 'Next.js', 'price': 'Free', 'score': 89, 'views': 11500, 'exports': 2600, 'preview_image': 'https://images.mixkit.co/cover-images/mixkit-vector-gradient-buttons-2199-large.jpg', 'description': 'Flexible pricing page with tier comparison, FAQ, and conversion-optimized CTA sections.'},
    {'name': 'Auth Pages', 'category': 'Auth', 'framework': 'React', 'price': 'Free', 'score': 88, 'views': 9800, 'exports': 2200, 'preview_image': 'https://images.mixkit.co/cover-images/mixkit-photographer-portrait-2458-large.jpg', 'description': 'Complete authentication flow with sign in, sign up, forgot password, and magic link.'},
    {'name': 'Contact Form', 'category': 'Form', 'framework': 'Svelte', 'price': 'Free', 'score': 87, 'views': 8200, 'exports': 1800, 'preview_image': 'https://images.mixkit.co/cover-images/mixkit-vector-gradient-buttons-2199-large.jpg', 'description': 'Beautiful contact form with validation, file upload, and email integration.'},
    {'name': 'Landing Page Kit', 'category': 'Landing', 'framework': 'React', 'price': '$19', 'score': 94, 'views': 31200, 'exports': 8100, 'preview_image': 'https://images.mixkit.co/cover-images/mixkit-photographer-portrait-2458-large.jpg', 'description': 'Multi-section landing page kit with hero, features, testimonials, and CTA components.'},
    {'name': 'SaaS Dashboard', 'category': 'Dashboard', 'framework': 'Vue', 'price': '$29', 'score': 92, 'views': 19500, 'exports': 5200, 'preview_image': 'https://images.mixkit.co/cover-images/mixkit-vector-gradient-buttons-2199-large.jpg', 'description': 'SaaS metrics dashboard with real-time charts, user management, and billing overview.'},
]
for d in designs_data:
    Design.objects.get_or_create(name=d['name'], defaults=d)
print(f'Seeded {Design.objects.count()} designs')
