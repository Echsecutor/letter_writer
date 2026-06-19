#import "@local/briefs:0.3.0": letter
#set text(lang: "de")

#show: letter.with(
  sender: (
    {% for line in Absender_sender_lines %}
    [{{ line }}],
    {% endfor %}
  ),
  recipient: [
    {{ Empfaenger_typst }}
  ],
  {% if briefs_information_extra_typst %}
  information-extra: [
    {{ briefs_information_extra_typst }}
  ],
  {% endif %}
  {% if Ort %}
  location: "{{ Ort }}",
  {% endif %}
  date: "{{ Datum_de | default(today_de) }}",
  subject: [{{ Betreff }}],
)

/* BODY_INJECT */
{% if signature_typst %}
{{ signature_typst }}
{% endif %}
