// sidebar
document.addEventListener('DOMContentLoaded', () => {
    let btn = document.querySelector('#btn');
    let sidebar = document.querySelector('.sidebar');
    let qlp = document.querySelector('#qlp');
    let dv = document.querySelector('.dv');
    let submenu = document.querySelector('.sub-menu');

    btn.onclick = function () {
        sidebar.classList.toggle('active');
    }

    sidebar.addEventListener('mouseover', function () {
        sidebar.classList.add('active');
    });

    sidebar.addEventListener('mouseout', function (event) {
        if (!sidebar.contains(event.relatedTarget)) {
            sidebar.classList.remove('active');
            submenu.classList.remove('active');
            dv.classList.remove('active');
        }
    });

    qlp.addEventListener('click', function () {
        submenu.classList.toggle('active');
        dv.classList.toggle('active');
    });

    document.addEventListener('mouseout', function (event) {
        if (!sidebar.contains(event.relatedTarget) && !sidebar.contains(event.target)) {
            sidebar.classList.remove('active');
            submenu.classList.remove('active');
            dv.classList.remove('active');
        }
    });
});

