const dropZone = document.getElementById("drop-zone");
    const fileInput = document.getElementById("file-input");
    const form = document.getElementById("tag-form");

    const titleInput = document.getElementById("title");
    const artistInput = document.getElementById("artist");
    const albumInput = document.getElementById("album");
    const yearInput = document.getElementById("year");
    const genreInput = document.getElementById("genre");

    let mp3Buffer = null;
    let originalFileName = "";

    dropZone.addEventListener("click", () => fileInput.click());

    dropZone.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropZone.style.backgroundColor = "#222";
    });

    dropZone.addEventListener("dragleave", () => {
      dropZone.style.backgroundColor = "#111";
    });

    dropZone.addEventListener("drop", async (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      await handleFile(file);
    });

    fileInput.addEventListener("change", () => {
      if (fileInput.files.length) {
        handleFile(fileInput.files[0]);
      }
    });

    async function handleFile(file) {
      if (!file.name.endsWith(".mp3")) return alert("Bitte eine MP3-Datei wählen.");
      originalFileName = file.name;

      const arrayBuffer = await file.arrayBuffer();
      mp3Buffer = arrayBuffer.slice(0);

      form.hidden = false;
      dropZone.textContent = `🎵 Datei geladen: ${file.name}`;
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const writer = new ID3Writer(mp3Buffer);
      writer.setFrame("TIT2", titleInput.value)
            .setFrame("TPE1", [artistInput.value])
            .setFrame("TALB", albumInput.value)
            .setFrame("TYER", yearInput.value)
            .setFrame("TCON", [genreInput.value]);

      writer.addTag();
      const blob = writer.getBlob();

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "edited_" + originalFileName;
      link.click();
    });