class Dictionary extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    const template = document.createElement("span");
    template.innerHTML = `
        <style>
            * {
              margin: 0;
              padding: 0;
            }
            span {
                cursor: context-menu;
            }
            .tooltip:not(:empty) {
              border: 1px solid #000;
              padding: 16px;
              border-radius: 8px;
              position: absolute;
              background: lightyellow;
            }
        </style>
        ${this.word}
        <div class="tooltip"></div>
      `;
    shadow.appendChild(template);
    this.showMeaning = this.showMeaning.bind(this);
    this.hideMeaning = this.hideMeaning.bind(this);
  }

  async showMeaning() {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${this.word}`
    );
    const data = await response.json();

    const { definition } = data[0].meanings[0].definitions[0];
    this.shadowRoot.querySelector(
      ".tooltip"
    ).innerHTML = `<b>${this.word}</b><p>${definition}</p>`;
  }

  hideMeaning() {
    this.shadowRoot.querySelector(".tooltip").innerHTML = "";
  }
  // fires after the element has been attached to the DOM
  connectedCallback() {
    const wordElement = this.shadowRoot.querySelector("span");
    wordElement.addEventListener("click", this.showMeaning, false);
    wordElement.addEventListener("mouseout", this.hideMeaning, false);
  }

  disconnectedCallback() {
    alert("disconnceted");
    const wordElement = this.shadowRoot.querySelector("span");
    wordElement.removeEventListener("mouseover");
  }

  get word() {
    return this.getAttribute("word") || "";
  }
}

window.customElements.define("word-dictionary", Dictionary);
