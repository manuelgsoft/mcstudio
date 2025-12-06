import {
  GlobeAsiaAustraliaIcon,
  LanguageIcon,
  ArrowDownIcon,
  ChatBubbleBottomCenterTextIcon,
  CheckBadgeIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const heroImage =
  "https://www.insignia.com/wp-content/uploads/2024/05/Insignia-luxury-travel-hero.jpeg";

const destinations = [
  { name: "Japón", image: "https://www.kyoto-to-do.com/wp-content/uploads/2024/07/to-ji-temple_main.jpg" },
  { name: "Tailandia", image: "https://cdn-imgix.headout.com/media/images/535ebc22d85245a90fd2c1c74fc62ffd-27586-phuket-from-phuket-phi-phi-island--bamboo--and-sunset-maiton-island-by-speed-catamaran-07.jpg?auto=format&w=1222.4&h=687.6&q=90&ar=16%3A9&crop=faces&fit=crop" },
  { name: "Bali", image: "https://media.digitalnomads.world/wp-content/uploads/2021/01/20120709/bali-for-digital-nomads.jpg" },
  { name: "Vietnam", image: "https://cdn.tourradar.com/s3/serp/original/5032_Gia44gKW.jpg" },
  { name: "México", image: "https://cdn.britannica.com/60/92960-050-327CF926/pyramid-Mayan-Chichen-Itza-Mex.jpg" },
  { name: "Estados Unidos", image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEju96UfJ__qqGz9x_iC1W1GoLLpaR-9aZog4cUSN6MHgd8NEHH-FwUNM1tjcCCF4UttqU2ddTj26CWmDuUhERrMQb6GCB2GOZnXNiFOAHDd-ouEIEJYgBrXGDI4px0vuF-ghOs1FQ7LaQ7k/s1600/Statue_of_Liberty%252C_NY.jpg" },
  { name: "Australia", image: "https://cdn.kimkim.com/files/a/images/50f0cfbba3a3e60a60e80fac4df73da3a2ae53dd/original-92774cfc8dd2a3a10af52ef8e67029f2.jpg" },
  { name: "España", image: "https://boat-haus.com/backoffice/images/337-andalucia.webp" },
  { name: "Italia", image: "https://www.wall-street.ro/img/f8881b90-1f37-4831-a4be-692c25514a27/ghid-de-calatorie-in-italia-tot-ce-trebuie-sa-stii.jpg?fm=jpg&q=80&fit=0&crop=1000%2C563%2C0%2C52&w=1440" },
  { name: "Canadá", image: "https://www.scenic.com.au/-/media/project/scenic/scenic-tours/scenic-au/blog/3000-x-1500-header-banner/scl_moraine_lake_banff_national_park_alberta_canada_006_3000x1500.jpg?h=1500&iar=0&w=3000&rev=703c5fae6f6d4e8f9230004571d19519&hash=5FBCC7D406065C1703CAC6A016709C41" },
];

const scrollingDestinations = [...destinations, ...destinations];

const steps = [
  {
    title: "1. Cuéntanos tu idea",
    desc: "Escuchamos tu estilo, fechas y presupuesto para ofrecerte la mejor experiencia",
  },
  {
    title: "2. Diseñamos a medida",
    desc: "Creamos un viaje único con rutas, actividades, alojamientos y tiempos optimizados",
  },
  {
    title: "3. Trabajamos por ti",
    desc: "Nos encargamos de reservas, coordinación y soporte durante el viaje",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f7f3eb] text-neutral-900">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-6 sm:px-10">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full text-orange-500">
            <GlobeAsiaAustraliaIcon className="h-12 w-12" />
          </div>
          <h1 className="text-3xl font-bold">MC Studio</h1>
        </div>
        <div className="hidden items-center gap-8 text-sm font-semibold text-neutral-700 md:flex">
          <span className="cursor-pointer text-orange-600">Inicio</span>
          <span className="cursor-pointer hover:text-neutral-900">Destinos</span>
          <span className="cursor-pointer hover:text-neutral-900">Sobre nosotros</span>
          <span className="cursor-pointer hover:text-neutral-900">Contacto</span>
        </div>
        <div className="hidden items-center gap-3 sm:flex">
          <button className="flex cursor-pointer items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 shadow-inner transition hover:-translate-y-0.5">
            <LanguageIcon className="h-6 w-6 text-orange-500" />
            Español
          </button>
          <button className="cursor-pointer rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-orange-600">
            Iniciar sesión
          </button>
        </div>
      </nav>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-12 sm:px-6 lg:px-10">
        <section className="relative min-h-[620px] overflow-hidden rounded-[28px] bg-neutral-900">
          <div
            className="absolute inset-0 bg-cover bg-center animate-hero-slide"
            style={{ backgroundImage: `url(${heroImage})` }}
            aria-label="Paisaje inspirador"
          />
          <div
            className="absolute inset-0 bg-linear-to-r from-black/75 via-black/50 to-transparent"
            aria-hidden
          />
          <div className="relative flex min-h-[620px] items-center px-6 py-10 sm:px-10 lg:px-14">
            <div className="max-w-xl space-y-4 text-white">
              <h2 className="text-8xl font-bold leading-tight sm:text-5xl">
                Diseñamos tu{" "}
                <span className="text-orange-400 font-extrabold">
                  viaje ideal
                </span>
              </h2>
              <p className="text-base text-gray-200 sm:text-lg">
                Itinerarios a medida para personas que buscan viajes cuidados, sencillos y elegantes
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <button className="cursor-pointer rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-orange-600">
                  Realiza tu consulta gratuita
                </button>
                <a
                  href="#destinos"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/60 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:border-white"
                >
                  Explorar destinos
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.title}
              className="flex flex-col gap-2 rounded-[18px] bg-white px-5 py-5 shadow-lg ring-1 ring-black/5"
            >
              <div className="flex items-center gap-2 text-orange-500">
                {step.title === "1. Cuéntanos tu idea" && (
                  <ChatBubbleBottomCenterTextIcon className="h-6 w-6" />
                )}
                {step.title === "2. Diseñamos a medida" && (
                  <CheckBadgeIcon className="h-6 w-6" />
                )}
                {step.title === "3. Trabajamos por ti" && (
                  <UserGroupIcon className="h-6 w-6" />
                )}
                <p className="text-base font-semibold text-orange-500">
                  {step.title}
                </p>
              </div>
              <p className="text-sm text-neutral-700">{step.desc}</p>
            </div>
          ))}
        </section>

        <section id="destinos" className="space-y-4 rounded-[20px] bg-white px-4 py-6 shadow-lg ring-1 ring-black/5 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="uppercase tracking-[0.2em] text-orange-500">
                Especializados en larga distancia
              </p>
              <h3 className="text-xl font-semibold text-neutral-900">
                Organizamos destinos como...
              </h3>
            </div>
          </div>
          <div className="relative w-full overflow-hidden">
            <div
              className="flex animate-marquee gap-4 whitespace-nowrap"
              style={{ minWidth: "max-content", animationDuration: "24s" }}
            >
              {scrollingDestinations.map((item, idx) => (
                <a
                  href="/destinos"
                  key={`${item.name}-${idx}`}
                  className="relative w-56 flex-none overflow-hidden rounded-2xl shadow-md transition hover:shadow-xl"
                >
                  <div
                    className="h-32 w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.image})` }}
                    aria-label={item.name}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent px-3 py-3">
                    <p className="text-sm font-semibold text-white">{item.name}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[18px] bg-white px-6 py-6 shadow-lg ring-1 ring-black/5 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="uppercase tracking-[0.2em] text-orange-600">
                Reseñas
              </p>
              <h3 className="text-xl font-semibold text-neutral-900">
                Aquellos que confiaron en nosotros
              </h3>
            </div>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-neutral-50 p-4 shadow-sm">
              <p className="text-sm font-semibold text-neutral-900">Lorena, España</p>
              <p className="text-xs text-neutral-500">Destino - Japón</p>
              <p className="mt-2 text-sm text-neutral-700">
                “Nos entendieron a la primera. Nuestro viaje no hubiera sido posible sin ellas”
              </p>
            </div>
            <div className="rounded-2xl bg-neutral-50 p-4 shadow-sm">
              <p className="text-sm font-semibold text-neutral-900">Fionn, Irlanda</p>
              <p className="text-xs text-neutral-500">Destino - Bali</p>
              <p className="mt-2 text-sm text-neutral-700">
                “Recomendaciones fuera de lo típico que nos permitieron disfrutar de sitios locales y auténticos”
              </p>
            </div>
            <div className="rounded-2xl bg-neutral-50 p-4 shadow-sm">
              <p className="text-sm font-semibold text-neutral-900">Luciano, Italia</p>
              <p className="text-xs text-neutral-500">Destino - Canadá</p>
              <p className="mt-2 text-sm text-neutral-700">
                “Disponibilidad absoluta, nos sentimos acompañados durante todo el viaje”
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[18px] bg-white px-6 py-6 shadow-lg ring-1 ring-black/5 sm:px-8">
          <div className="space-y-1">
            <p className="uppercase tracking-[0.2em] text-orange-600">
              Aquí comienza tu aventura
            </p>
            <h3 className="text-lg font-semibold text-neutral-900 sm:text-xl">
              Cuéntanos tus preferencias y agenda tu primera consulta gratuita
            </h3>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-center">
            <div className="rounded-xl bg-[#f1ebe1] px-4 py-3 text-sm text-neutral-800 shadow-inner">
              <p className="text-xs uppercase tracking-wide text-neutral-500">
                Destino
              </p>
              <p className="pt-1 text-base font-semibold">España</p>
            </div>
            <div className="rounded-xl bg-[#f1ebe1] px-4 py-3 text-sm text-neutral-800 shadow-inner">
              <p className="text-xs uppercase tracking-wide text-neutral-500">
                Fechas
              </p>
              <p className="pt-1 text-base font-semibold">
                01/09/2023 - 10/09/2023
              </p>
            </div>
            <div className="flex items-center justify-end">
              <button className="w-full cursor-pointer rounded-full bg-neutral-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-neutral-800 sm:w-auto">
                Consultar
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
