#import "@local/letter-pro:3.0.0": letter-simple
#set text(lang: "de")

#show: letter-simple.with(
  sender: (
    name: "Max Mustermann",
    address: "Berrenrather Str. 150, 50354 Hürth",
  ),
  recipient: [
    Firma Beispiel GmbH\ Musterstraße 1\ 12345 Musterstadt
  ],
  reference-signs: (
    
  ),
  date: "19.06.2026",
  subject: "Anfrage bezüglich Projekt X",
)

/* BODY_INJECT */
