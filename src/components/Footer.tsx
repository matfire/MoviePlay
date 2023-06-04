export default function Footer() {
  return (
    <footer className="footer footer-center p-4 bg-base-300 text-base-content">
      <div>
        <p>
          Copyright © {new Date().getFullYear()} - All right reserved by Matteo
          Gassend, made with ❤️, <a href="https://appwrite.io">Appwrite</a> and <a href="https://themoviedb.org">TMDB</a>
        </p>
      </div>
    </footer>
  );
}
