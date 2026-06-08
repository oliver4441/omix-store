import { Mail, Phone, MessageCircle, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-zinc-900 dark:text-white mb-3">Contact Us</h1>
        <p className="text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto">
          Have a question or need help? Reach out to our team in Kericho.
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        {/* Contact Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6">
            <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-4">Get in Touch</h3>
            <div className="space-y-4">
              <a href="mailto:omixsystems@gmail.com" className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300 hover:text-[#ff385c] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#ff385c]/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-[#ff385c]" />
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Email</p>
                  <p className="font-medium text-sm">omixsystems@gmail.com</p>
                </div>
              </a>
              <a href="tel:+254768213649" className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300 hover:text-[#ff385c] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#ff385c]/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-[#ff385c]" />
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Phone</p>
                  <p className="font-medium text-sm">+254 768 213 649</p>
                </div>
              </a>
              <a href="https://wa.me/254768213649?text=Hi%20Omix%20Store!" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300 hover:text-[#25D366] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                </div>
                <div>
                  <p className="text-xs text-zinc-400">WhatsApp</p>
                  <p className="font-medium text-sm">Chat with us</p>
                </div>
              </a>
              <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-300">
                <div className="w-10 h-10 rounded-xl bg-[#ff385c]/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[#ff385c]" />
                </div>
                <div>
                  <p className="text-xs text-zinc-400">Location</p>
                  <p className="font-medium text-sm">Kericho, Kenya</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#ff385c] to-[#e03150] rounded-2xl p-6 text-white">
            <h3 className="font-bold text-lg mb-2">M-Pesa Payments</h3>
            <p className="text-white/80 text-sm mb-3">Pay via M-Pesa Buy Goods</p>
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <p className="text-xs text-white/60 uppercase tracking-wider">Till Number</p>
              <p className="text-2xl font-black">9315501</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-3">
          <form action="https://formspree.io/f/mjgdyrrg" method="POST" className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 space-y-5">
            <h3 className="font-bold text-lg text-zinc-900 dark:text-white">Send us a Message</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Your Name *</label>
                <input required name="name" type="text" placeholder="e.g. Kiprono Yegon" className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:border-[#ff385c] focus:outline-none text-zinc-900 dark:text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Email *</label>
                <input required name="email" type="email" placeholder="you@example.com" className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:border-[#ff385c] focus:outline-none text-zinc-900 dark:text-white text-sm" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Phone</label>
                <input name="phone" type="tel" placeholder="07XXXXXXXX" className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:border-[#ff385c] focus:outline-none text-zinc-900 dark:text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Subject</label>
                <select name="subject" className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:border-[#ff385c] focus:outline-none text-zinc-900 dark:text-white text-sm appearance-none">
                  <option>General Inquiry</option>
                  <option>Order Question</option>
                  <option>Product Question</option>
                  <option>Delivery Issue</option>
                  <option>Partnership</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Message *</label>
              <textarea required name="message" rows={4} placeholder="Tell us how we can help..." className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 focus:border-[#ff385c] focus:outline-none text-zinc-900 dark:text-white text-sm resize-none" />
            </div>
            <button type="submit" className="w-full bg-[#ff385c] text-white font-bold py-3.5 rounded-xl hover:bg-[#e03150] transition-all shadow-lg shadow-[#ff385c]/20">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
