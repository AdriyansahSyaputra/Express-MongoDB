// Toggle dark mode
const themeToggle = document.getElementById("theme-toggle");
const html = document.documentElement;

// Check for saved user preference or use system preference
if (
  localStorage.getItem("theme") === "dark" ||
  (!localStorage.getItem("theme") &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  html.classList.add("dark");
} else {
  html.classList.remove("dark");
}

themeToggle.addEventListener("click", () => {
  html.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    html.classList.contains("dark") ? "dark" : "light"
  );
});

// Toggle sidebar
const sidebarToggle = document.getElementById("sidebar-toggle");
const sidebar = document.getElementById("sidebar");
const mainContent = document.getElementById("main-content");

// Check for saved sidebar state
if (localStorage.getItem("sidebar-collapsed") === "true") {
  sidebar.classList.add("sidebar-collapsed");
  mainContent.classList.add("content-expanded");
}

sidebarToggle.addEventListener("click", () => {
  sidebar.classList.toggle("sidebar-collapsed");
  mainContent.classList.toggle("content-expanded");
  localStorage.setItem(
    "sidebar-collapsed",
    sidebar.classList.contains("sidebar-collapsed")
  );
});

// Toggle dropdowns
const notificationsBtn = document.getElementById("notifications-btn");
const notificationsDropdown = document.getElementById("notifications-dropdown");
const profileBtn = document.getElementById("profile-btn");
const profileDropdown = document.getElementById("profile-dropdown");

notificationsBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  notificationsDropdown.classList.toggle("hidden");
  profileDropdown.classList.add("hidden");
});

profileBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  profileDropdown.classList.toggle("hidden");
  notificationsDropdown.classList.add("hidden");
});

// Close dropdowns when clicking outside
document.addEventListener("click", () => {
  notificationsDropdown.classList.add("hidden");
  profileDropdown.classList.add("hidden");
});

// Responsive behavior - collapse sidebar on small screens
function handleResize() {
  if (window.innerWidth < 768) {
    sidebar.classList.add("sidebar-collapsed");
    mainContent.classList.add("content-expanded");
  } else {
    // Restore user preference on larger screens
    if (localStorage.getItem("sidebar-collapsed") !== "true") {
      sidebar.classList.remove("sidebar-collapsed");
      mainContent.classList.remove("content-expanded");
    }
  }
}

window.addEventListener("resize", handleResize);
handleResize(); // Run on initial load

// Initialize CKEditor
let editor;

ClassicEditor.create(document.querySelector("#editor"), {
  toolbar: {
    items: [
      "heading",
      "|",
      "bold",
      "italic",
      "link",
      "bulletedList",
      "numberedList",
      "|",
      "blockQuote",
      "insertTable",
      "undo",
      "redo",
      "|",
      "codeBlock",
      "imageUpload",
    ],
  },
})
  .then((newEditor) => {
    editor = newEditor;
    window.editor = newEditor; // Untuk akses global
  })
  .catch((error) => {
    console.error("Editor initialization error:", error);
  });

document.getElementById("post-form").addEventListener("submit", function () {
  document.getElementById("editor-content").value = editor.getData();
});

// Featured Image Handling
const imageUploadContainer = document.getElementById("image-upload-container");
const imageUpload = document.getElementById("image-upload");
const imagePreview = document.getElementById("image-preview");
const imagePreviewPlaceholder = document.getElementById(
  "image-preview-placeholder"
);
const removeImageBtn = document.getElementById("remove-image-btn");

// Click to upload
imageUploadContainer.addEventListener("click", () => {
  imageUpload.click();
});

// File selection handler
imageUpload.addEventListener("change", function (e) {
  if (this.files && this.files[0]) {
    const reader = new FileReader();

    reader.onload = function (e) {
      imagePreview.src = e.target.result;
      imagePreview.classList.remove("hidden");
      imagePreviewPlaceholder.classList.add("hidden");
      removeImageBtn.classList.remove("hidden");
    };

    reader.readAsDataURL(this.files[0]);
  }
});

// Remove image handler
removeImageBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  resetImagePreview();
});

// Reset image preview
function resetImagePreview() {
  imagePreview.src = "#";
  imagePreview.classList.add("hidden");
  imagePreviewPlaceholder.classList.remove("hidden");
  removeImageBtn.classList.add("hidden");
  imageUpload.value = "";
}

// Drag and drop handlers
["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  imageUploadContainer.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

["dragenter", "dragover"].forEach((eventName) => {
  imageUploadContainer.addEventListener(eventName, highlight, false);
});

["dragleave", "drop"].forEach((eventName) => {
  imageUploadContainer.addEventListener(eventName, unhighlight, false);
});

function highlight() {
  imageUploadContainer.classList.add(
    "border-blue-500",
    "bg-blue-50",
    "dark:bg-gray-600"
  );
}

function unhighlight() {
  imageUploadContainer.classList.remove(
    "border-blue-500",
    "bg-blue-50",
    "dark:bg-gray-600"
  );
}

// Handle dropped files
imageUploadContainer.addEventListener("drop", handleDrop, false);

function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;

  if (files.length) {
    imageUpload.files = files;
    const event = new Event("change");
    imageUpload.dispatchEvent(event);
  }
}

// Tag Handling
const tagInput = document.getElementById("tag-input");
const addTagBtn = document.getElementById("add-tag-btn");
const tagsContainer = document.getElementById("tags-container");
const form = document.querySelector("post-form");

addTagBtn.addEventListener("click", addTag);
tagInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addTag();
  }
});

// Buat input hidden untuk tags
const hiddenTagsInput = document.createElement("input");
hiddenTagsInput.type = "hidden";
hiddenTagsInput.name = "tags";
form.appendChild(hiddenTagsInput);

function updateHiddenTags() {
  const tags = Array.from(tagsContainer.querySelectorAll("span")).map(
    (span) => span.textContent
  );
  hiddenTagsInput.value = JSON.stringify(tags);
}

function addTag(e) {
  e.preventDefault();
  const tagText = tagInput.value.trim();
  if (tagText) {
    const tagElement = document.createElement("div");
    tagElement.className =
      "flex items-center bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full text-sm";
    tagElement.innerHTML = `
            <span class="text-gray-700 dark:text-gray-300">${tagText}</span>
            <button id="remove-tag-btn" class="ml-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                <i class="fas fa-times text-xs"></i>
            </button>
        `;

    tagElement
      .querySelector("#remove-tag-btn")
      .addEventListener("click", () => {
        tagElement.remove();
      });

    tagsContainer.appendChild(tagElement);
    tagInput.value = "";
  }
}

document.querySelector(".btn-publish").addEventListener("click", async () => {
  const form = document.getElementById("post-form");
  const formData = new FormData(form);

  formData.append("tags", JSON.stringify(tags)); // tags dari array JS
  formData.append("content", CKEDITOR.instances.editor.getData()); // CKEditor5 atau sesuaikan

  const response = await fetch("/dashboard/posts/new", {
    method: "POST",
    body: formData,
  });

  const result = await response.json();
  if (!response.ok) {
    alert(result.errors.map((err) => err.msg).join("\n"));
  } else {
    alert("Post berhasil dibuat!");
  }
});
