/**
 * Created by xixin on 9/3/2014.
 */

function inline_html(){
    item_id = '';
    number = 10;
    return '<form class="form-inline" role="form"><input type="text" class="form-control" placeholder="数量"> <button type="button" class="btn btn-success">确认</button></form>'
}


$('.stockOut').popover({
    content:inline_html(),
    html:true
})