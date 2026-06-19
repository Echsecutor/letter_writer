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
    {% for ref in letter_pro_reference_signs %}
    ([{{ ref.display }}], []),
    {% endfor %}
  ),
  date: "{{ Datum_ort_line | default(today_ort_line) }}",
  subject: "{{ Betreff }}",
)

/* BODY_INJECT */
{% if signature_typst %}
{{ signature_typst }}
{% endif %}
