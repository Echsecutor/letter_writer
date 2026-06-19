---
backaddress: ${Rueckadresse:="Schmittner, Berrenrather Str. 150, 50354 Hürth"}
fromname: ${Absender_Name}
fromaddress: |
  ${Absender_Adresse:="Berrenrather Str. 150\\\\\n50354 Hürth"}
place: ${Ort:="Hürth"}
to: |
  ${Empfänger}
#yourmail: 26.06.2025
#yourmailname: Ihr Schreiben vom
#yourref: 56234-12 bzw. 5616124-3
#yourrefname: Debitorennummer/Belegnummer
date: ${Datum:=\\today}
subject: ${Betreff}
signature: |
  \bigskip
  
  ${Absender_Name}

# build like pandoc letter.md -o letter.pdf --template="letter"
...

${Anschreiben}