#!/usr/bin/env ruby

require 'rubygems'
require 'nokogiri'
require 'pp'
require 'ruby-debug'
require 'json/add/core'

class Ship
  attr_accessor :name, :class_type, :item_slots, :hull_points,
                :speed, :weapons, :engines, :computer, 
                :shields, :cargo_capacity, :cost, :purchase_locations
  
  def selectors 
    {:name => "td > h2", 
     :class_type => "td > p",
     :item_slots => "td:eq(2)",
     :hull_points => "td:eq(3)",
     :speed => "td:eq(4)",
     :weapons => "td:eq(5)",
     :engines => "td:eq(6)",
     :computer => "td:eq(7)",
     :shields => "td:eq(8)",
     :cargo_capacity => "td:eq(9)",
     :cost => "td:eq(10)",
     :purchase_locations => "td:eq(11)"}
  end

  def attributes
    [:name, :class_type, :item_slots, :hull_points, :speed,
     :weapons, :engines, :computer, :shields, :cargo_capacity,
     :cost, :purchase_locations, :id]
  end

  def initialize(row)
    @current_row = row
  end

  def parse
    selectors.each_pair do |key, value|
      instance_variable_set("@#{key.to_s}", @current_row.css(value).text.strip)
    end
    @id = self.name.gsub(" ", "-")
    @current_row = nil
  end

  def to_hash
    return_hash = {}
    attributes.collect {|property| return_hash[property] = instance_variable_get("@#{property.to_s}")}
    return_hash
  end
  
  def to_json
    self.to_hash.to_json
  end

end

class Item
  attr_accessor :name, :description, :red, :yellow, :green, :cooldown, :cost, :purchase_location

  def attributes
    [:name, :description, :red, :yellow, :green, :cooldown, :cost, :purchase_location, :id]
  end

  def selectors
    {:name => "td > h2",
     :description => "td > p",
     :red => "td:eq(2)",
     :yellow => "td:eq(3)",
     :green => "td:eq(4)",
     :cooldown => "td:eq(5)",
     :cost => "td:eq(6)",
     :purchase_location => "td:eq(7)"
    }
  end

  def initialize(row)
    @current_row = row
  end

  def parse
    selectors.each_pair do |key, value|
      instance_variable_set("@#{key.to_s}", @current_row.css(value).text.strip)
    end
    @id = self.name.gsub(" ", "-")
    @current_row = nil
  end

  def to_hash
    return_hash = {}
    attributes.collect {|property| return_hash[property] = instance_variable_get("@#{property.to_s}")}
    return_hash
  end

  def to_json
    self.to_hash.to_json
  end
end

ships_html = File.open("./html_data/ships.html").read
items_html = File.open("./html_data/items.html").read

puts "Read ships and items. Parsing..."

ships_doc = Nokogiri::HTML(ships_html)
items_doc = Nokogiri::HTML(items_html)

puts "Parsed documents."

ships_table = ships_doc.css("#ships")

ships = ships_table.css("tr")[1..-2].collect do |row|
  ship = Ship.new(row)
  ship.parse
  ship
end

items_table = items_doc.css("#items")

items = items_table.css("tr")[1..-2].collect do |row|
  item = Item.new(row)
  item.parse
  item
end
puts "Parsed #{ships.length} Ships and #{items.length} Items"
puts "Dumping JSON Data..."

File.open("./json_data/ships.json", "w+") {|f| f << ships.to_json}
File.open("./json_data/items.json", "w+") {|f| f << items.to_json}
