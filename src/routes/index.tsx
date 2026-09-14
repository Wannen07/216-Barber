import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: Index });

const services = ["Coupe Homme", "Barbe", "Coupe + Barbe", "Dégradé", "Styling"];

function Index() {
  return <main className="barber-site">
    <nav className="nav"><a className="brand" href="#top"><b>216</b><span>BARBER</span></a><div className="navlinks"><a href="#services">Services</a><a href="#galerie">Galerie</a><a href="#contact">Contact</a></div><a className="navcta" href="tel:+21653353839">Rendez-vous</a></nav>
    <section className="hero" id="top"><div className="hex"/><div className="hero-inner"><p className="eyebrow">BARBERSHOP • TUNISIE</p><h1><span>216</span> BARBER</h1><p className="tagline">Votre style. <em>Notre signature.</em></p><p className="intro">Une expérience barber moderne où précision, style et attention aux détails se rencontrent.</p><div className="actions"><a className="primary" href="tel:+21653353839">Prendre rendez-vous</a><a className="secondary" href="#contact">Nous contacter</a></div></div><a className="scroll" href="#about">SCROLL <span>↓</span></a></section>
    <section className="about reveal" id="about"><p className="eyebrow">L'EXPÉRIENCE 216</p><div><h2>Plus qu'une coupe.<br/><i>Une signature.</i></h2><p>Chez 216 BARBER, chaque détail compte. Une approche personnalisée, un espace soigné et une exécution précise pour un look qui vous ressemble.</p></div></section>
    <section className="services" id="services"><div className="section-head"><p className="eyebrow">NOS SERVICES</p><h2>Le style,<br/>sans compromis.</h2></div><div className="service-grid">{services.map((s,i)=><article className="service" key={s}><span>0{i+1}</span><h3>{s}</h3><p>Prix sur demande</p></article>)}</div></section>
    <section className="gallery" id="galerie"><div className="gallery-copy"><p className="eyebrow">L'UNIVERS 216</p><h2>Un espace pensé<br/>pour votre style.</h2><p>Découvrez l'ambiance 216 BARBER — lignes nettes, lumière graphique et attention portée à chaque client.</p></div><div className="gallery-cards"><div className="photo-card photo-one"><span>INTÉRIEUR</span></div><div className="photo-card photo-two"><span>ÉQUIPE</span></div><div className="photo-card photo-three"><span>216 BARBER</span></div></div></section>
    <section className="why"><p className="eyebrow">POURQUOI 216 BARBER</p><div className="why-grid">{[["01","Précision"],["02","Style"],["03","Hygiène"],["04","Service personnalisé"]].map(x=><div key={x[1]}><span>{x[0]}</span><h3>{x[1]}</h3></div>)}</div></section>
    <section className="reviews"><p className="eyebrow">AVIS CLIENTS</p><h2>Votre expérience<br/>parle pour nous.</h2><div className="review-grid"><blockquote>“Votre avis apparaîtra ici.”<small>— Témoignage client</small></blockquote><blockquote>“Votre avis apparaîtra ici.”<small>— Témoignage client</small></blockquote></div></section>
    <section className="booking"><p className="eyebrow">RENDEZ-VOUS</p><h2>Prêt pour votre<br/><i>prochain look ?</i></h2><a className="primary big" href="tel:+21653353839">Prendre rendez-vous →</a></section>
    <section className="contact" id="contact"><div><p className="eyebrow">NOUS TROUVER</p><h2>216 BARBER</h2><p>Résidence Diar Sidi Mansour, Tunisie</p><a href="tel:+21653353839">+216 53 353 839</a></div><div className="map"><span>GOOGLE MAPS</span><p>Emplacement à connecter</p></div></section>
    <footer><a className="brand" href="#top"><b>216</b><span>BARBER</span></a><div><a href="#services">Services</a><a href="#galerie">Galerie</a><a href="#contact">Contact</a></div><div><span>Instagram — à ajouter</span><span>Facebook — à ajouter</span></div><small>© 216 BARBER</small></footer>
    <a className="floating-call" href="tel:+21653353839" aria-label="Appeler 216 BARBER">☎</a>
  </main>;
}
