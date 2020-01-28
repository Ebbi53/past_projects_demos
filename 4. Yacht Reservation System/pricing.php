<?php

function get_price()
{
  $start = get_param('start'); // start date (and time) as timestamp
  // $end = get_param('end'); // end date (and time) as timestamp
  // $duration = floor(($end - $start + 60) / 60); // duration in minutes
  // $quantity = get_param('count'); // quantity
  $resource = get_param('resource'); // ID of the resource
  $site_id = get_param('site_id'); // 
  $Start_time = str_replace(":00", "", get_param('Start_time')); // 
  $End_time = str_replace(":00", "", get_param('End_time')); // 
  $Reservation_Type = get_param('Reservation_Type'); // 
  $Password = get_param('Password'); // 
  $user = get_param('user'); // 
  $email = get_param('email'); // 
  $user_executive = get_param('user_executive'); // 
  $existing_rental_id = get_param('existing_rental_id'); // 
  $existing_rental_creation = get_param('existing_rental_creation'); // 
  $existing_price = get_param('existing_price'); // 
  $existing_regular_price = get_param('existing_regular_price'); // 
  $Any_extra_requests___additional_charge_ = get_param('Any_extra_requests___additional_charge_'); // 
  $admin_mode = get_param('admin_mode'); // 
  $Speedboat = get_param('Speedboat'); // 
  $Number_of_Carlsberg_Beers = get_param('Number_of_Carlsberg_Beers'); // 
  $Number_of_Coke = get_param('Number_of_Coke'); // 
  $Number_of_Heineken_Beers = get_param('Number_of_Heineken_Beers'); // 
  $Number_of_Sprite___7_Up = get_param('Number_of_Sprite___7_Up'); // 
  $Number_of_Medium_Sized_Distilled_Water_bottles = get_param('Number_of_Medium_Sized_Distilled_Water_bottles'); // 
  $Number_of_packs_of_ice_for_cooling_drinks__60lbs_each_ = get_param('Number_of_packs_of_ice_for_cooling_drinks__60lbs_each_'); // 

  $price = 0.00; // set the price here
  $can_reserve = true; // set to true if reservation is allowed, or to false otherwise
  $info_text = ""; // you can add additional description to the price here (or error message if reservation is not possible)

  if (!is_null($Password) && $Password !== "jsaplanyo2019") {
    $can_reserve = false;
    $info_text = "<span class='pr_err '>Invalid Password.</span>";
  } else {
    $isWeekend = date("l", $start) == "Saturday" || date("l", $start) == "Sunday";
    $info_text .= "<span class='rate_extra'><dl id='breakdown' class='dl-horizontal'>
    <dt><span class='br_res_name'>Base Fare</span>
        <div class='br_extra_info'>HKD 1000.00 per day</div>
    </dt>
    <dd>HKD 1000.00</dd>";
    if ($Reservation_Type == "Business") {
      $price += 5000;
      $info_text .= "<dt>Business Reservation <div class='br_extra_info'>+HKD 4000.00 per day</div>
      </dt>
      <dd>HKD 4000.00</dd>";
    } else {
      $price += 1000;
      if ($isWeekend) {
        $price += 1000;
        $info_text .= "<dt>Weekend <div class='br_extra_info'>+HKD 1000.00 per day</div>
        </dt>
        <dd>HKD 1000.00</dd>";
      }
    }

    if ($End_time > $Start_time) {
      if ($End_time - $Start_time > 7) {
        $price += 500 * ($End_time - $Start_time - 7);
        $info_text .= "<dt>Extra Hours <div class='br_extra_info'>+HKD 500.00 * " . ($End_time - $Start_time - 7) . "</div>
        </dt>
        <dd>HKD " . sprintf("%.2f", 500 * ($End_time - $Start_time - 7)) . "</dd>";
      }
    } else {
      $can_reserve = false;
      $info_text = "<span class='pr_err '>End-Time cannot be less than or equal to the Start-Time.</span>";
    }

    if ($Any_extra_requests___additional_charge_ == "Yes" && $can_reserve) {
      if ($Speedboat == "Yes") {
        $price += 3400;
        $info_text .= "<dt>Speedboat <div class='br_extra_info'>+HKD 3400.00</div>
        </dt>
        <dd>HKD 3400.00</dd>";
      }
      if ($Number_of_Carlsberg_Beers > 0) {
        $price += 10.00 * $Number_of_Carlsberg_Beers;
        $info_text .= "<dt>Carlsberg Beers <div class='br_extra_info'>+HKD 10.00 * {$Number_of_Carlsberg_Beers}</div>
        </dt>
        <dd>HKD " . sprintf("%.2f", 10 * $Number_of_Carlsberg_Beers) . "</dd>";
      }
      if ($Number_of_Heineken_Beers > 0) {
        $price += 10.00 * $Number_of_Heineken_Beers;
        $info_text .= "<dt>Heineken Beers <div class='br_extra_info'>+HKD 10.00 * {$Number_of_Heineken_Beers}</div>
        </dt>
        <dd>HKD " . sprintf("%.2f", 10 * $Number_of_Heineken_Beers) . "</dd>";
      }
      if ($Number_of_Coke > 0) {
        $price += 10.00 * $Number_of_Coke;
        $info_text .= "<dt>Coke <div class='br_extra_info'>+HKD 10.00 * {$Number_of_Coke}</div>
        </dt>
        <dd>HKD " . sprintf("%.2f", 10 * $Number_of_Coke) . "</dd>";
      }
      if ($Number_of_Sprite___7_Up > 0) {
        $price += 10.00 * $Number_of_Sprite___7_Up;
        $info_text .= "<dt>Sprite / 7-Up <div class='br_extra_info'>+HKD 10.00 * {$Number_of_Sprite___7_Up}</div>
        </dt>
        <dd>HKD " . sprintf("%.2f", 10 * $Number_of_Sprite___7_Up) . "</dd>";
      }
      if ($Number_of_Medium_Sized_Distilled_Water_bottles > 0) {
        $price += 10.00 * $Number_of_Medium_Sized_Distilled_Water_bottles;
        $info_text .= "<dt>Water Bottles <div class='br_extra_info'>+HKD 10.00 * {$Number_of_Medium_Sized_Distilled_Water_bottles}</div>
        </dt>
        <dd>HKD " . sprintf("%.2f", 10 * $Number_of_Medium_Sized_Distilled_Water_bottles) . "</dd>";
      }
      if ($Number_of_packs_of_ice_for_cooling_drinks__60lbs_each_ > 0) {
        $price += 120.00 * $Number_of_packs_of_ice_for_cooling_drinks__60lbs_each_;
        $info_text .= "<dt>Ice packs <div class='br_extra_info'>+HKD 120.00 * {$Number_of_packs_of_ice_for_cooling_drinks__60lbs_each_}</div>
        </dt>
        <dd>HKD " . sprintf("%.2f", 120 * $Number_of_packs_of_ice_for_cooling_drinks__60lbs_each_) . "</dd>";
      }
    }

    if ($email && $can_reserve && $Reservation_Type !== "Business") {
      $temp = [60, 45, 30, 14];
      if (($user_executive == 1 && $start - time() > 5184000) || ($user_executive == 2 && $start - time() > 3888000) || ($user_executive == 3 && $start - time() > 2592000) || ($user_executive == 4 && $start - time() > 1209600) || (!$user_executive && $start - time() > 1209600)) {
        $can_reserve = false;
        $days = $user_executive ? $temp[$user_executive - 1] : 14;
        $info_text = "<span class='pr_err '>Sorry, you're not allowed to book more than {$days} days in advance.</span>";
      }
    }

    if ($user && $can_reserve && $Reservation_Type !== "Business" && (!$existing_rental_id || $admin_mode)) {
      $req = curl_init();
      $postvars = array(
        "start_time" => rawurlencode(date('Y-m', $start) . '-01 00:00'),
        "end_time" => rawurlencode(date('Y-m-t', $start) . ' 23:59'),
        "resource_id" => $resource,
        "site_id" => $site_id,
        "sort" => "start_time",
        "sort_reverse" => true,
        "detail_level" => 2,
        "user_id" => $user,
        "excluded_status" => 24,
        "api_key" => "08371d1b6bced79e9d921a1cecd007e2d4551cbdb3016f08b7105b006c5d80",
        "method" => "list_reservations",
        "hash_timestamp" => time(),
      );
      $postvars["hash_key"] = md5("H5906582d25bb4aca0d8eab7325fda28d5f34a6221cb0f9002d995692574f5f" . $postvars["hash_timestamp"] . "list_reservations");

      $options = array(
        CURLOPT_URL => "https://www.planyo.com/rest/",
        CURLOPT_HEADER => 0,
        CURLOPT_POST => true,
        CURLOPT_RETURNTRANSFER => 1,
        CURLOPT_POSTFIELDS => $postvars,
      );

      curl_setopt_array($req, $options);

      $data = json_decode(curl_exec($req), true);
      $results = $data["data"]["results"];
      if ($results) {
        for ($i = 0; $i < count($results); $i++) {
          // $weekend = date('w', strtotime($results[$i]["start_time"]));
          if ($results[$i]["properties"]["Reservation_Type"] != "Business") {
            if ($admin_mode && $existing_rental_id) {
              $req1 = curl_init();
              $postvars1 = array(
                "reservation_id" => $existing_rental_id,
                "api_key" => "08371d1b6bced79e9d921a1cecd007e2d4551cbdb3016f08b7105b006c5d80",
                "method" => "get_reservation_data",
                "hash_timestamp" => time(),
              );
              $postvars1["hash_key"] = md5("H5906582d25bb4aca0d8eab7325fda28d5f34a6221cb0f9002d995692574f5f" . $postvars1["hash_timestamp"] . "get_reservation_data");

              // $options["CURLOPT_POSTFIELDS"] = $postvars1;

              $options1 = array(
                CURLOPT_URL => "https://www.planyo.com/rest/",
                CURLOPT_HEADER => 0,
                CURLOPT_POST => true,
                CURLOPT_RETURNTRANSFER => 1,
                CURLOPT_POSTFIELDS => $postvars1,
              );
              curl_setopt_array($req1, $options1);

              $data1 = json_decode(curl_exec($req1), true);
              curl_close($req1);
              if (date('n', $start) == date('n', strtotime($data1["data"]["start_time"]))) {
                continue;
              }
            }
            $can_reserve = false;
            $info_text = "<span class='pr_err '>Sorry, you already have a booking in this month.</span>";
            break;
          }
        }
      }

      //To restrict 6 bookings each year

      // $postvars["start_time"] = $start - 31536000;
      // $postvars["hash_timestamp"] = time();
      // $postvars["hash_key"] = md5("H5906582d25bb4aca0d8eab7325fda28d5f34a6221cb0f9002d995692574f5f" . $postvars["hash_timestamp"] . "list_reservations");
      // curl_setopt($req, CURLOPT_POSTFIELDS, $postvars);

      // $data = json_decode(curl_exec($req), true);
      // $results = $data["data"]["results"];
      // $reservationsCount = 0;
      // if ($results) {
      //   for ($i = 0; $i < count($results); $i++) {
      //     $weekend = date('w', strtotime($results[$i]["start_time"]));
      //     if ($results[$i]["properties"]["Reservation_Type"] != "Business" && ($weekend == 0 || $weekend == 6)) {
      //       $reservationsCount++;
      //     }
      //     if ($reservationsCount == 6) {
      //       $info_text = "<span class='pr_err '>Sorry, you cannot have more than 6 Weekend bookings in a year.</span>";
      //       break;
      //     }
      //   }
      // }

      curl_close($req);
      // print_r($data);
    }

    if ($can_reserve) {
      $info_text .= "<dt class='br_total'>**Total</dt>
        <dd class='br_total'>HKD " . sprintf("%.2f", $price) . "</dd>";
      if ($existing_rental_id) {
        $info_text .= "<dt>(Previous Price 
        </dt>
        <dd>HKD " . sprintf("%.2f", $existing_price) . ")</dd>
        </dl></span>";
      }
    }
  }

  // return the pricing information as array, see http://www.planyo.com/faq.php?q=137 for full reference
  $info = array(
    "price" => $price,
    "regular_price" => $price,
    "deposit" => null,
    "can_reserve" => $can_reserve,
    "info_text" => $can_reserve ? $info_text : null,
    "error_text" => $can_reserve ? null : $info_text,
    "prevent_admin_reservation" => false,
  );
  return $info;
}

/////////////////////////////////////////////////////////////////////////////

// all date/time functions will work fine with timezone set to UTC
date_default_timezone_set('UTC');
global $INTERNAL_PARAMS;
$INTERNAL_PARAMS = array();

function get_param($name)
{
  global $INTERNAL_PARAMS;
  if (array_key_exists($name, $INTERNAL_PARAMS))
    return $INTERNAL_PARAMS[$name];
  if (array_key_exists($name, $_REQUEST))
    return $_REQUEST[$name];
  return null;
}

function set_param($name, $value)
{
  global $INTERNAL_PARAMS;
  $INTERNAL_PARAMS[$name] = $value;
}

$price = get_price();

if (!is_array($price)) { // make sure we have an array and not a single numerical value
  $price = array("price" => $price, "can_reserve" => strpos($price, "Error:") == false);
}

// try to prefetch prices for other parameter sets (makes search much faster)
$prefetch_index = 2;
while (true) {
  if (get_param('price' . $prefetch_index . '-start')) {
    // use a different parameter set
    $params = array('start', 'end', 'resource', 'count', 'resname');
    foreach ($params as $p) {
      set_param($p, get_param('price' . $prefetch_index . '-' . $p));
    }
    $additional_price = get_price();
    $price['price' . $prefetch_index] = $additional_price;
  } else {
    break;
  }
  $prefetch_index++;
}

echo json_encode($price);
