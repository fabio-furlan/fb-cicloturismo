import { Container } from '@/components/ui/Container'

// Foto: Patrick Hendry / Unsplash (Licença Unsplash: uso gratuito, inclusive comercial)
// https://unsplash.com/photos/1ow9zrlldJU
const fotoDestaque = '/images/hero-bikepacking.jpg'

/** Banner principal da página inicial, com foto em tela cheia. */
export function SecaoDestaque() {
  return (
    <section
      className="relative flex min-h-[80svh] items-start bg-night-800 bg-cover bg-[position:40%_center] sm:min-h-[85vh] sm:bg-center"
      style={{ backgroundImage: `url(${fotoDestaque})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/15 to-black/35" />

      <Container className="relative pt-28 sm:pt-36 lg:pt-40">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight text-white drop-shadow-md sm:text-5xl lg:text-6xl">
          Viagens de bike
          <br />
          pela <span className="text-amber-400">natureza</span>
        </h1>
        <p className="mt-4 max-w-xl text-base text-white/90 drop-shadow sm:text-lg">Página inicial em construção.</p>
      </Container>
    </section>
  )
}
