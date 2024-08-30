document.addEventListener('DOMContentLoaded', function () {
    var sortableList1 = document.getElementById('cursos_list');
    var sortableList2 = document.getElementById('materias_list');

    Sortable.create(sortableList1, {
        animation: 150,
        handle: '.sortable-item',
        ghostClass: 'sortable-ghost',
        
    });

    Sortable.create(sortableList2, {
        animation: 150,
        handle: '.sortable-item',
        ghostClass: 'sortable-ghost',
        
    });
});