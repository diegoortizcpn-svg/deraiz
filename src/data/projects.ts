import frambuesaImg from "@/assets/frambuesa.jpg";
import hongosImg from "@/assets/hongos.jpg";
import pistachoImg from "@/assets/pistacho.jpg";
import mielImg from "@/assets/miel.jpg";
import type { AssetCode } from "@/config/assets";

export const TOKEN_MEANING =
  "1 token = 1 kg de producción de un lote demostrativo ficticio. Token de prueba en testnet: no se compra, no tiene valor económico y no otorga derechos sobre ingresos ni activos.";

export type Project = {
  slug: string;
  name: string;
  assetCode: AssetCode;
  status: string;
  country: string;
  countryFlag: string;
  location: string;
  crop: string;
  image: string;
  summary: string;
  sheet: { label: string; value: string }[];
  testSupply: string;
  timeline: { title: string; detail: string }[];
  risks: string[];
};

export const projects: Project[] = [
  {
    slug: "frambuesa",
    name: "Frambuesa Valle Rojo",
    assetCode: "FRAMB",
    status: "En implantación",
    country: "Perú",
    countryFlag: "🇵🇪",
    location: "Lambayeque, Perú",
    crop: "Frambuesa",
    image: frambuesaImg,
    summary:
      "Lote demostrativo de frambuesa refloreciente con riego por goteo y macrotúneles. Hitos productivos ilustrativos.",
    sheet: [
      { label: "Variedad", value: "Refloreciente, 2 cosechas por año" },
      { label: "Lote demo", value: "2 ha" },
      { label: "Plantas", value: "13.000 plantas" },
      { label: "Tecnología", value: "Riego por goteo y macrotúneles" },
    ],
    testSupply: "10.000 FRAMB",
    timeline: [
      { title: "Preparación del suelo", detail: "Acondicionamiento del lote demostrativo." },
      { title: "Plantación", detail: "Implantación de las 13.000 plantas." },
      { title: "Primera cosecha", detail: "Primer ciclo productivo registrado." },
      { title: "Segunda cosecha", detail: "Segundo ciclo del año." },
    ],
    risks: ["Clima", "Plagas", "Ejecución de obra"],
  },
  {
    slug: "hongos",
    name: "Hongos Micelio Sur",
    assetCode: "HONGO",
    status: "Ciclo en curso",
    country: "Argentina",
    countryFlag: "🇦🇷",
    location: "Buenos Aires, Argentina",
    crop: "Hongos",
    image: hongosImg,
    summary:
      "Producción de hongos comestibles y funcionales en ciclos cortos, con hitos validados por un tercero independiente.",
    sheet: [
      { label: "Comestibles", value: "Gírgola, shiitake" },
      { label: "Funcionales", value: "Reishi, melena de león" },
      { label: "Duración del ciclo", value: "45 a 90 días" },
      { label: "Validación", value: "Hitos validados por un tercero independiente" },
    ],
    testSupply: "3.000 HONGO",
    timeline: [
      { title: "Preparación de sustrato", detail: "Formulación y pasteurizado." },
      { title: "Inoculación", detail: "Siembra del micelio en sustrato." },
      { title: "Incubación", detail: "Colonización en sala controlada." },
      { title: "Fructificación", detail: "Aparición de los cuerpos fructíferos." },
      { title: "Cosecha", detail: "Recolección y registro del ciclo." },
    ],
    risks: ["Contaminación del cultivo", "Habilitaciones sanitarias", "Comercialización"],
  },
  {
    slug: "pistacho",
    name: "Pistacho Oasis Cuyano",
    assetCode: "PISTA",
    status: "En crecimiento",
    country: "Argentina",
    countryFlag: "🇦🇷",
    location: "San Juan, Argentina",
    crop: "Pistacho",
    image: pistachoImg,
    summary:
      "Cultivo de largo plazo en zona árida, con trazabilidad del desarrollo del monte año por año.",
    sheet: [
      { label: "Horizonte", value: "Cultivo de largo plazo" },
      { label: "Primera cosecha", value: "Varios años desde la plantación" },
      { label: "Lote demo", value: "5 ha" },
      { label: "Región", value: "Oasis irrigado de San Juan" },
    ],
    testSupply: "8.000 PISTA",
    timeline: [
      { title: "Plantación", detail: "Implantación del monte demostrativo." },
      { title: "Crecimiento", detail: "Desarrollo vegetativo y formación." },
      { title: "Primera cosecha", detail: "Entrada en producción." },
      { title: "Cosechas anuales", detail: "Ciclos productivos sucesivos." },
    ],
    risks: [
      "Granizo",
      "Heladas tardías",
      "Viento Zonda",
      "Vecería (años alternados de alta y baja producción)",
    ],
  },
  {
    slug: "miel",
    name: "Miel Monte Dorado",
    assetCode: "MIEL",
    status: "Temporada activa",
    country: "Argentina",
    countryFlag: "🇦🇷",
    location: "Santiago del Estero, Argentina",
    crop: "Miel",
    image: mielImg,
    summary:
      "Miel de monte nativo, lejos de zonas cultivadas, con registro de temporada y origen en testnet.",
    sheet: [
      { label: "Origen", value: "Monte nativo, lejos de zonas cultivadas" },
      { label: "Floraciones", value: "Algarrobo y mistol" },
      { label: "Colmenas", value: "300 colmenas" },
      { label: "Manejo", value: "Trashumancia mínima, sanidad monitoreada" },
    ],
    testSupply: "6.000 MIEL",
    timeline: [
      { title: "Floración", detail: "Inicio de la temporada de néctar." },
      { title: "Extracción", detail: "Cosecha de cuadros y extracción en sala." },
      { title: "Envasado", detail: "Fraccionado y control de calidad." },
      { title: "Despacho", detail: "Salida de lotes registrada." },
    ],
    risks: ["Dependencia del clima y la floración", "Sanidad de las colmenas"],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const countries = Array.from(new Set(projects.map((p) => p.country)));
export const crops = Array.from(new Set(projects.map((p) => p.crop)));
