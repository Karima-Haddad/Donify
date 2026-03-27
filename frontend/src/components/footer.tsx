import "../styles/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <p>
          📧 contact@donify.tn | 📞 +216 00 000 000 | 🇹🇳 Tunisie
        </p>

        <p className="footer__copyright">
          © {new Date().getFullYear()} Donify — Tous droits réservés
        </p>
      </div>
    </footer>
  );
}