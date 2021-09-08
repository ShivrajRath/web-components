class CheckList extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    const template = document.createElement("div");
    template.classList.add("container");
    template.innerHTML = this.templateHTML;
    shadow.appendChild(template);
  }

  get templateHTML() {
    return `<style> 
    * {
        margin:0; 
        padding:0;
    }
    .title {
        padding-bottom: 1rem;
    }
    .list-item > * {
        cursor: pointer;
    }
    .list-item > label {
        margin-left: 0.5rem;
    }
    .list-item.complete {
        text-decoration: line-through;
    }
    </style>
    <h2 class="title">${this.title}</h2>
    <div class="list">${this.list
      .map(
        (item) =>
          `<div class="list-item"><input type="checkbox" id="${item}" name="${item}" value="${item}"/><label for="${item}">${item}</label></div>`
      )
      .join("")}</div>`;
  }

  connectedCallback() {
    const listItems = [...this.shadowRoot.querySelectorAll(".list-item input")];
    this.addClickListener(listItems);
  }

  toggleCheckbox = (e) => {
    const parent = e.target.parentNode;
    if (parent.classList.contains("complete")) {
      parent.classList.remove("complete");
    } else {
      parent.classList.add("complete");
    }
  };

  addClickListener = (listItems) => {
    listItems.forEach((item) =>
      item.addEventListener("click", this.toggleCheckbox, false)
    );
  };

  get title() {
    return this.getAttribute("title");
  }

  get list() {
    const listArr = [];
    [...this.attributes].forEach((attr) => {
      if (attr.name.includes("list-item")) {
        listArr.push(attr.value);
      }
    });
    return listArr;
  }
}

window.customElements.define("check-list", CheckList);
