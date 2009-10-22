//ShipBuilder

$(document).ready(function(){
  ship_builder.load_ships();    
  ship_builder.load_items();
  $(".ship").live("click", ship_builder.select_ship);
  $(".ship").live("mouseover", function(){
    $(this).css("background-color", '#ffff99');
  });
  $(".ship").live("mouseout", function(){
    $(this).css("background-color", "#ffffff");
  });
  
  $(".item").live("click", ship_builder.handle_item_click);
  $(".item").live("mouseover", function(){
    current_background_color = $(this).css("background-color");
    $(this).css("background-color", '#ffff99');

    $(".item").live("mouseout", function(){
      $(this).css("background-color", current_background_color);
    });
  });
});

var ship_builder = {
  ships: {},
  items: {},
  current_ship: null,
  selected_items: [],
  calculate_validity: function(){
    valid = true;
    
    slots = parseInt(ship_builder.current_ship.item_slots);
    if(slots < $("#selected_items > .item").length)
    {
      valid = false;
      $("#" + ship_builder.current_ship.id + " > .item_slots").css("background-color", "red");
    }

    total_red = 0;
    total_yellow = 0;
    total_green = 0;

    valid_red = parseInt(ship_builder.current_ship.weapons);
    valid_yellow = parseInt(ship_builder.current_ship.engines);
    valid_green = parseInt(ship_builder.current_ship.computer);

    $.each($("#selected_items > .item"), function(){
      item = ship_builder.items[this.id];
      total_red += parseInt(item.red);
      total_yellow += parseInt(item.yellow);
      total_green += parseInt(item.green);
    });

    if(total_red > valid_red)
    {
      valid = false;
      $('#' + ship_builder.current_ship.id).find('.weapons').css("background-color", "red");
    }

    if(total_yellow > valid_yellow)
    {
      valid = false;
      $('#' + ship_builder.current_ship.id).find('.engines').css("background-color", "red");
    }

    if(total_green > valid_green)
    {
      valid = false;
      $('#' + ship_builder.current_ship.id).find('.computer').css("background-color", "red");
    }

    if(valid)
    {
      $("#selected_items > .item").css("background-color", "green");
      $("#" + ship_builder.current_ship.id + " > .gem_groups > span").css("background-color", "white");
      $("#" + ship_builder.current_ship.id + " > .item_slots").css("background-color", "white");
    }
    else
    {
      $("#selected_items > .item").css("background-color", "red");
    }

  },
  handle_item_click: function(){
    console.log(this.id);
    if($(this).parent().attr("id") == "items")
    {
      item = ship_builder.items[this.id];
      $(this).remove();
      $("#selected_items").append(ship_builder.insert_item(item));
    }
    else
    {
      item = ship_builder.items[this.id];
      $(this).remove();
      $("#items").append(ship_builder.insert_item(item));
    }
    ship_builder.calculate_validity();
  },
  select_ship: function(){
    ship_builder.current_ship = ship_builder.ships[this.id];
    $(".ship").hide();
    $("#" + this.id).show();
    $("#ships > h2").empty().append("<a href='#' onclick='ship_builder.deselect_ship();return false;'>Deselect Ship</a>");
    $("#items").show();
    $("#selected_items").show();
  },
  deselect_ship: function(){
    ship_builder.current_ship = null;
    $(".ship").show();
    $("#ships > h2").text("Select A Ship");
    $("#items").hide();
    $("#selected_items").hide();

    $.each($("#selected_items > .item"), function(){
      item = ship_builder.items[this.id];
      $("#items").append(ship_builder.insert_item(item));
      $(this).remove();
    });

    ship_builder.calculate_validity();
  },
  load_ships: function() {
    $.getJSON('json_data/ships.json', {}, function(data){
      $.each(data, function(){
        ship_builder.ships[this.id] = this;
      });

      $.each(ship_builder.ships, function(){
        $("#ships").append(ship_builder.insert_ship(this));
      });
    });  
  },

  load_items: function() {
    $.getJSON('json_data/items.json', {}, function(data){
      $.each(data, function(){
        ship_builder.items[this.id] = this;
      });

      $.each(ship_builder.items, function(){
        $("#items").append(ship_builder.insert_item(this));
      });
    });  
  },

  insert_ship: function(ship){
    return "<div id='"+ ship.id +"' class='ship'> \
      <span class='name'>"+ ship.name +"</span> \
      <span class='class_type'>"+ ship.class_type +"</span> \
      <div class='stat_group'> \
        <span class='item_slots'>Slots: "+ ship.item_slots +"</span> \
        <span class='hull_points'>Hull: "+ ship.hull_points +"</span> \
        <span class='speed'>Speed: "+ ship.speed +"</span> \
      </div> \
      <span class='cargo_capacity'>Capacity: "+ ship.cargo_capacity +"</span> \
      <span class='cost'>Cost: "+ ship.cost +"</span> \
      <span class='purchase_location'>"+ ship.purchase_locations + "</span> \
      <div class='gem_groups'> \
        <span class='weapons'>"+ ship.weapons +"</span> \
        <span class='engines'>"+ ship.engines +"</span> \
        <span class='computer'>"+ ship.computer +"</span> \
        <span class='shields'>"+ ship.shields +"</span> \
      </div> \
    </div>";
  },

  insert_item: function(item){
    return "<div id='" + item.id + "' class='item'> \
      <span class='name'>" + item.name + "</span> \
      <span class='description'>" + item.description + "</span> \
      <span class='cooldown'>Cooldown: "+ item.cooldown + "</span> \
      <span class='cost'>Cost: "+ item.cost + "</span> \
      <span class='purchase_location'>"+ item.purchase_location +"</span>\
      <div class='gem_groups'> \
        <span class='red'>"+ item.red + "</span> \
        <span class='yellow'>"+ item.yellow + "</span> \
        <span class='green'>"+ item.green + "</span> \
      </div> \
    </div>";
  }
};
