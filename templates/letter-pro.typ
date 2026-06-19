#import "@local/letter-pro:3.0.0": letter-simple
#set text(lang: "de")

#show: letter-simple.with(
  sender: (
    name: "{{ Absender_Name }}",
    address: "{{ Absender_Adresse | default('Berrenrather Str. 150, 50354 Hürth') }}",
  ),
  recipient: [
    {{ Empfaenger_typst }}
  ],
  reference-signs: (
    {% for ref in reference_signs %}
    ([{{ ref.label }}], [{{ ref.value }}]),
    {% endfor %}
  ),
  date: "{{ Datum | default(today_de) }}",
  subject: "{{ Betreff }}",
)

/* BODY_INJECT */
