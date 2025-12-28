export default function Footer() {
  return (
    <footer className="bg-foreground text-background mt-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <span className="font-bold text-lg">Fusion Designs</span>
            </div>
            <p className="text-sm opacity-75">
              Your destination for trendy and timeless fashion.
            </p>
          </div>

          {/* Shop */}
          <div className="space-y-4">
            <h3 className="font-semibold">Shop</h3>
            <ul className="space-y-2 text-sm opacity-75">
              <li>
                <a href="#" className="hover:opacity-100 transition">
                  New Arrivals
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100 transition">
                  Best Sellers
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100 transition">
                  Sale
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100 transition">
                  Collections
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-semibold">Support</h3>
            <ul className="space-y-2 text-sm opacity-75">
              <li>
                <a href="#" className="hover:opacity-100 transition">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100 transition">
                  Shipping Info
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100 transition">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100 transition">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm opacity-75">
              <li>
                <a href="#" className="hover:opacity-100 transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100 transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100 transition">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:opacity-100 transition">
                  Accessibility
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row items-center justify-between text-sm opacity-75">
          <p>&copy; 2026 Fusion Designs. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:opacity-100 transition">
              Instagram
            </a>
            <a href="#" className="hover:opacity-100 transition">
              Twitter
            </a>
            <a href="#" className="hover:opacity-100 transition">
              Facebook
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
