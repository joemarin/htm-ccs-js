$(function () {
	$("#navbarToggle").blur(function(event) {	
		var screenWidth = window.innerWidth;
		if (screenWidth < 768) {
			$("#collapsable-nav").collapse('hide');
		}
	});
});

(function (global) {
	var dc = {};

  //home placement
	var homeHtml = "snippets/home-snippet.html";

	//menu categories replacement
  var allCategoriesUrl =
  	"http://davids-restaurant.herokuapp.com/categories.json";
  var categoriesTitleHtml = "snippets/categories-title-snippet.html";
  var categoryHtml = "snippets/category-snippet.html";

  //single menu replacement
  var menuItemsUrl =
  	"https://davids-restaurant.herokuapp.com/menu_items.json?category=";
  var menuItemsTitleHtml = "snippets/menu-items-title.html";
  var menuItemHtml = "snippets/menu-item.html";

	//insert html
	var insertHtml = function (selector, html) {
		var targetElem = document.querySelector(selector);
		targetElem.innerHTML = html;
	};

	//show loading icon
	var showLoading = function (selector) {
		var html = "<div class='text-center'>";
		html += "<img src='images/ajax-loader.gif'></div>";
		insertHtml(selector, html);
	};

	//return substitute of '{{propName}}'
	//with propValue in given 'string'
	var insertProperty = function (string, propName, propValue) {
		var propToReplace = "{{" + propName + "}}";
		string = string.		
			replace(new RegExp(propToReplace, "g"), propValue);
		return string;
	};

  //on page load
  document.addEventListener("DOMContentLoaded", function(event) {
  	//on first load
 	
  	showLoading("#main-content");

  	$ajaxUtils.sendGetRequest(
  		homeHtml,
  		function (responseText) {
				document.querySelector("#main-content").innerHTML = responseText;
  		},
  		false);

  	dc.loadMenuCategories = function () {
  		showLoading("#main-content");

  		$ajaxUtils.sendGetRequest(
  			allCategoriesUrl,
  			buildAndShowCategoriesHTML,
  			true);
  	};

  	dc.loadMenuItems = function (categoryShort) {
  		showLoading("#main-content");
debugger;
  		$ajaxUtils.sendGetRequest(
  			menuItemsUrl + categoryShort,
  			buildAndShowMenuItemsHTML,
  			true);
  	};
  });

  	//builds html for the categories page based on the data from the server
  	function buildAndShowCategoriesHTML(categories) {
  		//load title snippet of categories page
  		$ajaxUtils.sendGetRequest(
  			categoriesTitleHtml,
  			function(categoriesTitleHtml) {
  				//retrieve single category snippet
  				$ajaxUtils.sendGetRequest(
  					categoryHtml,
  					function (categoryHtml) {
		  				var categoriesViewHtml =
		  					buildCategoriesViewHtml(categories,
		  															 		categoriesTitleHtml,
		  																  categoryHtml);
		  					insertHtml("#main-content", categoriesViewHtml);
  					},
  					false);
  			},
  			false);
  	};

  	//using categories data and snippets html
  	//build categories view HTML to be inserted into page
  	function buildCategoriesViewHtml (
  		categories,
  		categoriesTitleHtml,
  		categoryHtml
  		) {
	  		var finalHtml = categoriesTitleHtml;
	  		finalHtml += "<section class='row'>";

	  		//loop over categories
	  		for (var i = 0; i < categories.length; i++) {
	  			//insert category values
	  			var html = categoryHtml;
	  			var name = "" + categories[i].name;
	  			var short_name = categories[i].short_name;

	  			html =
	  				insertProperty(html, "name", name);
	  			html =
	  				insertProperty(html,
	  											 "short_name",
	  											 short_name);
	  				finalHtml += html;
	  		};

	  		finalHtml += "</section>"
	  		return finalHtml;
  	};

  	function buildAndShowMenuItemsHTML(categoryMenuItems) {
  		//load title snippet of menu items page
  		$ajaxUtils.sendGetRequest(
  			menuItemsTitleHtml,
  			function(menuItemsTitleHtml) {
  				//retrieve single category snippet
  				$ajaxUtils.sendGetRequest(
  					menuItemHtml,
  					function (menuItemHtml) {
		  				var menuItemsViewHtml =
		  					buildMenuItemsViewHtml(categoryMenuItems,
		  															 	 menuItemsTitleHtml,
		  																 menuItemHtml);
		  					insertHtml("#main-content", menuItemsViewHtml);
  					},
  					false);
  			},
  			false);
  	};

  	function buildMenuItemsViewHtml (
  		categoryMenuItems,
  		menuItemsTitleHtml,
  		menuItemHtml
  		) {

  			menuItemsTitleHtml =
  				insertProperty(menuItemsTitleHtml,
  											 "name",
  											 categoryMenuItems.category.name);

  			menuItemsTitleHtml =
  				insertProperty(menuItemHtml,
  											 "special_instructions",
  											 categoryMenuItems.category.special_instructions);

	  		var finalHtml = menuItemsTitleHtml;
	  		finalHtml += "<section class='row'>";

	  		//loop over menu items
	  		var menuItems = categoryMenuItems.menu_items;
	  		var catShortName = categoryMenuItems.category.short_name;

	  		for (var i = 0; i < menuItems.length; i++) {
	  			//insert menu item values
	  			var html = menuItemHtml;

	  			html =
	  				insertProperty(html, "catShortName", catShortName);

	  			html =
	  				insertItemPrice(html, "price_small", menuItems[i].price_small);

	  			html =
	  				insertItemPortionName(html, "small_portion_name", menuItems[i].small_portion_name);

	  			html =
	  				insertItemPrice(html, "price_large", menuItems[i].price_large);

	  			html =
	  				insertItemPortionName(html, "large_portion_name", menuItems[i].large_portion_name);

	  			html =
	  				insertProperty(html, "name", menuItems[i].name);

	  			html =
	  				insertProperty(html, "description", menuItems[i].description);

	  			if (i % 2 != 0) {
	  				html += "<div class='clearfix visible-md-block visible-lg-block'></div>";
	  			}

	  		  finalHtml += html;
	  		};

	  		finalHtml += "</section>";

	  		return finalHtml;
  	};


	// Appends price with '$' if price exists
	function insertItemPrice(html,
	                         pricePropName,
	                         priceValue) {
	  // If not specified, replace with empty string
	  if (!priceValue) {
	    return insertProperty(html, pricePropName, "");;
	  }

	  priceValue = "$" + priceValue.toFixed(2);
	  html = insertProperty(html, pricePropName, priceValue);
	  return html;
	}


	// Appends portion name in parens if it exists
	function insertItemPortionName(html,
	                               portionPropName,
	                               portionValue) {
	  // If not specified, return original string
	  if (!portionValue) {
	    return insertProperty(html, portionPropName, "");
	  }

	  portionValue = "(" + portionValue + ")";
	  html = insertProperty(html, portionPropName, portionValue);
	  return html;
	}

	global.$dc = dc;

}) (window);

