const { PDFDocument } = PDFLib

async function CreateThePDF() {
    const respone = await fetch("../assets/DNDForm/CharacterSheet.pdf")
    const pdfArrayBuffer = await respone.arrayBuffer();

    const pdfDoc = await PDFDocument.load(pdfArrayBuffer)
    
    const form = pdfDoc.getForm()

    const nameField = form.getTextField("CharacterName")

    nameField.setText(character.player_name)

    const pdfBytes = await pdfDoc.save()
    const blob = new Blob([pdfBytes], { type: "application/pdf"})
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a")

    a.href = url
    a.download = "CharacterSheet.pdf"
    a.click()
    URL.revokeObjectURL(url);
}





