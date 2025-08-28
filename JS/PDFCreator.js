const { PDFDocument } = PDFLib

async function CreateThePDF() {
    //fetching local doc (note: might not work if website published ever and might only work because vscode plugin)
    const respone = await fetch("../assets/DNDForm/CharacterSheet.pdf")
    const pdfArrayBuffer = await respone.arrayBuffer();

    const pdfDoc = await PDFDocument.load(pdfArrayBuffer)
    
    const form = pdfDoc.getForm()

    //Form fields
    const nameField = form.getTextField("CharacterName")

    //Setting form fields
    nameField.setText(character.player_name)

    //save and download form
    /*
    const pdfBytes = await pdfDoc.save()
    const blob = new Blob([pdfBytes], { type: "application/pdf"})
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a")

    a.href = url
    a.download = "CharacterSheet.pdf"
    a.click()
    URL.revokeObjectURL(url);
    */
}





