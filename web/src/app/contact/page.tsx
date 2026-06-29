import { Header } from "@/components/layout/Header";

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-container-max px-margin-mobile pb-32 pt-24 md:px-margin-desktop">
        <h1 className="mb-4 font-display text-headline-md text-primary">
          Contact
        </h1>
        <p className="mb-8 font-body text-body-md text-on-surface-variant">
          Une question sur nos créations ? Nous serions ravis de vous répondre.
        </p>
        <form className="max-w-md space-y-6">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block font-body text-label-md text-secondary"
            >
              Nom
            </label>
            <input
              id="name"
              type="text"
              className="w-full border-b-2 border-outline-variant bg-transparent py-2 font-body text-body-md text-on-surface focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block font-body text-label-md text-secondary"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full border-b-2 border-outline-variant bg-transparent py-2 font-body text-body-md text-on-surface focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="mb-2 block font-body text-label-md text-secondary"
            >
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              className="w-full rounded-t-xl border-b-2 border-outline-variant bg-surface-container-low px-3 py-2 font-body text-body-md text-on-surface focus:border-primary focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-full bg-primary px-8 py-4 font-body text-label-md text-on-primary transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-95"
          >
            Envoyer
          </button>
        </form>
      </main>
    </>
  );
}
