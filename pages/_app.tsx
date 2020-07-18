import "normalize.css";
import "../styles/global.scss";
import "../styles/aggrid.scss";

export default function App({ Component, pageProps }) {
  return (
    <div className="next-app w-screen h-screen">
      <Component {...pageProps} />
    </div>
  );
}
