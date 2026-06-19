#import "@local/pc-letter:0.4.0"

#let letter = pc-letter.init(
  author: (
    name: "{{ Absender_Name }}",
    address: ({{ Absender_Adresse_typst_array }}),
  ),
  {% if Datum_datetime_typst %}
  date: {{ Datum_datetime_typst }},
  {% else %}
  date: auto,
  {% endif %}
  {% if Ort %}
  place-name: "{{ Ort }}",
  {% endif %}
  style: (
    locale: (lang: "de", region: "DE"),
    medium: "print",
  ),
  title: "{{ Betreff }}",
)

#show: letter.letter-style

{% if pc_letter_reference_typst %}
#(letter.reference-field)[{{ pc_letter_reference_typst }}]
{% endif %}

#(letter.address-field)[
  {{ Empfaenger_typst }}
]

= {{ Betreff }}

/* BODY_INJECT */
