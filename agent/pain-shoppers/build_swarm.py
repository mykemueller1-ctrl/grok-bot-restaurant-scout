#!/usr/bin/env python3
"""Build the Never86 swarm vendor catalog and regenerate all pain-shopper agents."""

from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CATALOG_PATH = ROOT / "vendors" / "catalog.json"

COLORS = {
    "pos": ["#E63946", "#457B9D", "#1D3557", "#2A9D8F", "#E76F51", "#F4A261", "#9B2226", "#264653", "#6A4C93", "#118AB2"],
    "silo": ["#D62828", "#F77F00", "#FCBF49", "#003049", "#669BBC", "#80B918", "#5C4D7D", "#BC4749", "#386641", "#A7C957"],
    "marketplace": ["#9B2226", "#AE2012", "#BB3E03", "#CA6702", "#EE9B00"],
    "ordering": ["#0077B6", "#00B4D8", "#90E0EF", "#023E8A", "#48CAE4"],
    "loyalty": ["#7B2CBF", "#9D4EDD", "#C77DFF", "#E0AAFF", "#5A189A"],
    "reservations": ["#2D6A4F", "#40916C", "#52B788", "#74C69D", "#95D5B2"],
    "payments": ["#212529", "#495057", "#6C757D", "#ADB5BD", "#343A40"],
    "reputation": ["#FF006E", "#FB5607", "#FFBE0B", "#8338EC", "#3A86FF"],
}


def slug(s: str) -> str:
    s = s.lower().strip()
    s = s.replace("&", "and").replace("/", "-").replace("+", "-plus-")
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


def seeds(name: str, extras: list[str] | None = None) -> list[str]:
    base = [
        f"{name} sucks restaurant",
        f"{name} fees",
        f"leaving {name}",
        f"switching off {name}",
        f"{name} hate restaurant",
        f"{name} support nightmare",
        f"replacing {name} restaurant",
    ]
    if extras:
        base.extend(extras)
    seen: set[str] = set()
    out: list[str] = []
    for q in base:
        key = q.lower()
        if key not in seen:
            seen.add(key)
            out.append(q)
    return out


def vendor(
    name: str,
    *,
    category: str,
    domain: str | None = None,
    legal: str | None = None,
    aliases: list[str] | None = None,
    rank: int | None = None,
    extras: list[str] | None = None,
    vid: str | None = None,
) -> dict:
    v: dict = {
        "id": vid or slug(name),
        "name": name,
        "legal": legal or name,
        "category": category,
        "aliases": aliases or [name],
        "seed_queries": seeds(name, extras),
    }
    if domain:
        v["domain"] = domain
    if rank is not None:
        v["rank"] = rank
    return v


def dedupe(items: list[dict]) -> list[dict]:
    seen: set[str] = set()
    out: list[dict] = []
    for it in items:
        if it["id"] in seen:
            continue
        seen.add(it["id"])
        out.append(it)
    return out


def build_catalog() -> dict:
    pos = [
        vendor("Toast", category="pos", legal="Toast, Inc.", rank=1, aliases=["Toast POS", "Toast Tab", "Fuck Toast", "ToastHQ"], extras=["fuck Toast POS", "Toast crashed mid service", "Toast contract lock-in"]),
        vendor("Square for Restaurants", category="pos", legal="Block, Inc.", rank=2, vid="square", aliases=["Square POS", "Square Restaurants"], extras=["Square frozen mid rush"]),
        vendor("Clover", category="pos", legal="Fiserv / Clover", rank=3, aliases=["Clover POS", "Clover Station", "Clover Mini"]),
        vendor("Lightspeed Restaurant", category="pos", legal="Lightspeed Commerce", rank=4, vid="lightspeed", aliases=["Lightspeed POS", "Lightspeed K-Series"]),
        vendor("NCR Aloha", category="pos", legal="NCR Voyix / Aloha", rank=5, vid="aloha", aliases=["Aloha POS", "NCR Aloha", "Aloha Cloud"], extras=["legacy Aloha nightmare"]),
        vendor("TouchBistro", category="pos", legal="TouchBistro Inc.", rank=6, vid="touchbistro", aliases=["Touch Bistro", "TB POS"]),
        vendor("SpotOn", category="pos", legal="SpotOn Transact", rank=7, vid="spoton", aliases=["Spot On POS", "SpotOn POS"]),
        vendor("PAR Brink", category="pos", legal="PAR Technology (Brink POS)", rank=8, vid="par-brink", aliases=["Brink POS", "PAR Brink", "Brink by PAR"]),
        vendor("Oracle MICROS / Simphony", category="pos", legal="Oracle Food & Beverage", rank=9, vid="oracle-micros", aliases=["MICROS", "Oracle Simphony", "Simphony POS", "MICROS 9700"]),
        vendor("SkyTab", category="pos", legal="Shift4 / SkyTab", rank=10, vid="skytab", aliases=["Sky Tab", "Shift4 POS", "SkyTab POS"]),
        vendor("Revel Systems", category="pos", legal="Revel Systems", vid="revel", aliases=["Revel POS"]),
        vendor("Heartland Restaurant", category="pos", legal="Global Payments / Heartland", vid="heartland", aliases=["Heartland POS", "Heartland Restaurant POS"]),
        vendor("Qu Beyond", category="pos", legal="Qu Beyond / Qu POS", vid="qu", aliases=["Qu POS", "Quickly POS", "Qu Restaurant"]),
        vendor("Lavu", category="pos", legal="Lavu Inc.", aliases=["Lavu POS", "Lavu iPad"]),
        vendor("ShopKeep", category="pos", legal="Lightspeed / ShopKeep", aliases=["ShopKeep POS"]),
        vendor("Talech", category="pos", legal="Talech / US Bank", aliases=["Talech POS"]),
        vendor("NCR Silver", category="pos", legal="NCR Voyix", vid="ncr-silver", aliases=["NCR Silver POS"]),
        vendor("Squirrel Systems", category="pos", legal="Squirrel Systems", vid="squirrel", aliases=["Squirrel POS"]),
        vendor("POSitouch", category="pos", legal="Hospitality Solutions", aliases=["POSI touch", "POSitouch POS"]),
        vendor("Dinerware", category="pos", legal="Dinerware", aliases=["Dinerware POS"]),
        vendor("Focus POS", category="pos", legal="Focus Softnet / Focus POS", vid="focus-pos", aliases=["Focus POS system"]),
        vendor("HungerRush", category="pos", legal="HungerRush (formerly SpeedLine)", vid="hungerrush", aliases=["HungerRush POS", "SpeedLine POS", "SpeedLine"]),
        vendor("Xenial", category="pos", legal="Xenial / ParTech", aliases=["Xenial POS", "Xenial Cloud"]),
        vendor("AccuPOS", category="pos", legal="AccuPOS", aliases=["AccuPOS restaurant"]),
        vendor("Upserve POS", category="pos", legal="Lightspeed / Upserve", vid="upserve-pos", aliases=["Breadcrumb POS", "Upserve Breadcrumb"]),
        vendor("Aldelo", category="pos", legal="Aldelo", aliases=["Aldelo POS", "Aldelo For Restaurants"]),
        vendor("Harbortouch", category="pos", legal="Shift4 / Harbortouch", aliases=["Harbortouch POS", "HT POS"]),
        vendor("Bentro", category="pos", legal="Bentro", aliases=["Bentro POS"]),
        vendor("Epos Now", category="pos", legal="Epos Now", vid="epos-now", aliases=["Epos Now restaurant"]),
        vendor("SumUp POS", category="pos", legal="SumUp", vid="sumup", aliases=["SumUp restaurant POS"]),
        vendor("PayPal Zettle", category="pos", legal="PayPal", vid="zettle", aliases=["Zettle POS", "iZettle restaurant"]),
        vendor("Future POS", category="pos", legal="Future POS", vid="future-pos", aliases=["FuturePOS"]),
        vendor("PixelPoint", category="pos", legal="PixelPoint / NCR", aliases=["PixelPoint POS"]),
        vendor("InfoGenesis", category="pos", legal="Agilysys InfoGenesis", vid="infogenesis", aliases=["InfoGenesis POS", "Agilysys POS"]),
        vendor("Maitre'D", category="pos", legal="Posera / Maitre'D", vid="maitred", aliases=["MaitreD POS", "Maitre'D POS"]),
        vendor("RPower", category="pos", legal="RPower", aliases=["RPower POS"]),
        vendor("Tabit", category="pos", legal="Tabit", aliases=["Tabit POS"]),
        vendor("Cake POS", category="pos", legal="Sysco / Cake", vid="cake-pos", aliases=["Cake by Sysco", "Sysco Cake POS"]),
        vendor("Tillster", category="pos", legal="Tillster", aliases=["Tillster kiosk", "Tillster POS"]),
        vendor("Nextep", category="pos", legal="Nextep Systems", aliases=["Nextep kiosk", "Nextep POS"]),
        vendor("Silverware POS", category="pos", legal="Silverware POS", vid="silverware", aliases=["Silverware Restaurant POS"]),
        vendor("Thrive POS", category="pos", legal="Thrive POS", vid="thrive", aliases=["ThrivePOS"]),
        vendor("Union POS", category="pos", legal="Union", vid="union-pos"),
        vendor("Omnivore", category="pos", legal="Omnivore IO", aliases=["Omnivore POS middleware"]),
        vendor("Salido", category="pos", legal="Salido", aliases=["Salido POS"]),
        vendor("Toast Now", category="pos", legal="Toast, Inc.", vid="toast-now"),
        vendor("H&L POS", category="pos", legal="H&L Australia", vid="hl-pos"),
        vendor("Idealpos", category="pos", legal="Idealpos", aliases=["Ideal POS"]),
        vendor("Impos", category="pos", legal="Impos", aliases=["Impos POS"]),
        vendor("Kounta", category="pos", legal="Lightspeed / Kounta", aliases=["Kounta POS"]),
    ]

    silo = [
        vendor("7shifts", category="silo", domain="scheduling_labor", aliases=["7 shifts", "Seven Shifts"]),
        vendor("HotSchedules", category="silo", domain="scheduling_labor", aliases=["Hot Schedules", "Fourth HotSchedules"]),
        vendor("Harri", category="silo", domain="scheduling_labor", aliases=["Harri HCM", "Harri scheduling"]),
        vendor("Homebase", category="silo", domain="scheduling_labor", aliases=["Join Homebase"]),
        vendor("When I Work", category="silo", domain="scheduling_labor", vid="wheniwork", aliases=["WhenIWork"]),
        vendor("Deputy", category="silo", domain="scheduling_labor"),
        vendor("Sling", category="silo", domain="scheduling_labor", aliases=["Sling scheduling"]),
        vendor("Fourth", category="silo", domain="scheduling_labor", aliases=["Fourth hospitality", "Fourth RMS"]),
        vendor("SynergySuite", category="silo", domain="ops_suite", aliases=["Synergy Suite"]),
        vendor("Humanity", category="silo", domain="scheduling_labor", aliases=["Humanity scheduling"]),
        vendor("Toast Payroll", category="silo", domain="payroll", vid="toast-payroll"),
        vendor("Gusto", category="silo", domain="payroll", aliases=["Gusto payroll restaurant"]),
        vendor("ADP RUN", category="silo", domain="payroll", vid="adp-run", aliases=["ADP restaurant payroll"]),
        vendor("Paychex", category="silo", domain="payroll"),
        vendor("Restaurant365", category="silo", domain="accounting_ops", aliases=["R365", "Restaurant 365"]),
        vendor("Compeat", category="silo", domain="accounting_ops", aliases=["Compeat Advantage"]),
        vendor("QuickBooks Restaurant", category="silo", domain="accounting_ops", vid="quickbooks", aliases=["QuickBooks Online restaurant", "QBO restaurant"]),
        vendor("Xero Restaurant", category="silo", domain="accounting_ops", vid="xero"),
        vendor("Plate IQ", category="silo", domain="ap_automation", vid="plateiq", aliases=["PlateIQ"]),
        vendor("Bill.com Restaurant", category="silo", domain="ap_automation", vid="bill-com"),
        vendor("MarginEdge", category="silo", domain="cogs_ap", aliases=["Margin Edge"]),
        vendor("xtraCHEF", category="silo", domain="cogs_ap", vid="extrachef", aliases=["Extra Chef", "ExtraChef", "xtraCHEF by Toast"]),
        vendor("Crunchtime", category="silo", domain="enterprise_ops", aliases=["Crunch Time"]),
        vendor("MarketMan", category="silo", domain="inventory", aliases=["Market Man"]),
        vendor("CTUIT", category="silo", domain="inventory", vid="ctuit", aliases=["CTUIT Compeat"]),
        vendor("Orderly", category="silo", domain="inventory", aliases=["Orderly.io"]),
        vendor("BevSpot", category="silo", domain="beverage_inventory", aliases=["Bev Spot"]),
        vendor("BlueCart", category="silo", domain="ordering_procurement", aliases=["Blue Cart"]),
        vendor("Craftable", category="silo", domain="inventory"),
        vendor("WISK.ai", category="silo", domain="inventory", vid="wisk", aliases=["WISK inventory"]),
        vendor("Galley Solutions", category="silo", domain="recipe_ops", vid="galley"),
        vendor("ClearCOGS", category="silo", domain="cogs_ap", vid="clearcogs"),
        vendor("Partender", category="silo", domain="beverage_inventory"),
        vendor("Cut+Dry", category="silo", domain="procurement", vid="cut-dry"),
        vendor("Olo", category="silo", domain="online_ordering", aliases=["Olo ordering", "Olo Rails"]),
        vendor("ChowNow", category="silo", domain="online_ordering", aliases=["Chow Now"]),
        vendor("Chowly", category="silo", domain="online_ordering_middleware"),
        vendor("Otter", category="silo", domain="delivery_ops", aliases=["Otter tablet"]),
        vendor("ItsaCheckmate", category="silo", domain="delivery_ops", vid="checkmate", aliases=["Checkmate integration"]),
        vendor("Deliverect", category="silo", domain="delivery_ops"),
        vendor("GloriaFood", category="silo", domain="online_ordering", aliases=["Gloria Food"]),
        vendor("MenuDrive", category="silo", domain="online_ordering"),
        vendor("Owner.com", category="silo", domain="online_ordering", vid="owner-com"),
        vendor("Slice", category="silo", domain="online_ordering"),
        vendor("Ritual", category="silo", domain="online_ordering"),
        vendor("Lunchbox", category="silo", domain="online_ordering"),
        vendor("Bbot", category="silo", domain="online_ordering", aliases=["Bbot by DoorDash"]),
        vendor("Punchh", category="silo", domain="loyalty_crm"),
        vendor("Thanx", category="silo", domain="loyalty_crm"),
        vendor("Paytronix", category="silo", domain="loyalty_crm"),
        vendor("Fishbowl", category="silo", domain="loyalty_crm", aliases=["Fishbowl Instant Marketing"]),
        vendor("FiveStars", category="silo", domain="loyalty_crm"),
        vendor("Spendgo", category="silo", domain="loyalty_crm"),
        vendor("LevelUp", category="silo", domain="loyalty_crm"),
        vendor("Toast Loyalty", category="silo", domain="loyalty_crm", vid="toast-loyalty"),
        vendor("Square Loyalty", category="silo", domain="loyalty_crm", vid="square-loyalty"),
        vendor("Klaviyo Restaurant", category="silo", domain="marketing", vid="klaviyo"),
        vendor("Popmenu", category="silo", domain="marketing_web", aliases=["Pop Menu"]),
        vendor("OpenTable", category="silo", domain="reservations", aliases=["Open Table"]),
        vendor("Resy", category="silo", domain="reservations"),
        vendor("SevenRooms", category="silo", domain="reservations", aliases=["Seven Rooms"]),
        vendor("Tock", category="silo", domain="reservations"),
        vendor("Yelp Guest Manager", category="silo", domain="reservations", vid="yelp-guest-manager"),
        vendor("Waitlist Me", category="silo", domain="waitlist", vid="waitlistme"),
        vendor("Hostme", category="silo", domain="waitlist"),
        vendor("Fresh KDS", category="silo", domain="kds", vid="fresh-kds", aliases=["FreshKDS"]),
        vendor("QSR Automations", category="silo", domain="kds", vid="qsr-automations"),
        vendor("Toast KDS", category="silo", domain="kds", vid="toast-kds"),
        vendor("GiveX", category="silo", domain="gift_cards"),
        vendor("FreedomPay", category="silo", domain="payments"),
        vendor("Birdeye", category="silo", domain="reputation"),
        vendor("Yext", category="silo", domain="reputation"),
        vendor("Podium", category="silo", domain="reputation"),
        vendor("Ovation", category="silo", domain="reputation"),
        vendor("Jolt", category="silo", domain="ops_checklists"),
        vendor("Avero", category="silo", domain="analytics"),
        vendor("Upserve", category="silo", domain="legacy_ops", aliases=["Upserve by Lightspeed"]),
        vendor("ProfitSword", category="silo", domain="analytics"),
        vendor("Mashgin", category="silo", domain="checkout_ai"),
        vendor("Presto", category="silo", domain="ai_voice_ordering", aliases=["Presto AI"]),
        vendor("Hi Auto", category="silo", domain="ai_voice_ordering", vid="hi-auto"),
        vendor("Keel", category="silo", domain="delivery_ops"),
        vendor("UrbanPiper", category="silo", domain="delivery_ops"),
        vendor("FoodConnex", category="silo", domain="procurement", vid="foodconnex"),
        vendor("OpsAnalitica", category="silo", domain="ops_checklists", vid="opsanalitica"),
        vendor("ReviewTrackers", category="silo", domain="reputation", vid="reviewtrackers"),
        vendor("Toast Online Ordering", category="silo", domain="online_ordering", vid="toast-online-ordering"),
        vendor("7shifts Payroll", category="silo", domain="payroll", vid="7shifts-payroll"),
        vendor("Homebase Payroll", category="silo", domain="payroll", vid="homebase-payroll"),
        vendor("4P Foods Ops", category="silo", domain="procurement", vid="4p-foods"),
        vendor("Restaurant Depot Portal", category="silo", domain="procurement", vid="restaurant-depot"),
        vendor("Sysco Market", category="silo", domain="procurement", vid="sysco-market"),
        vendor("US Foods Online", category="silo", domain="procurement", vid="us-foods"),
        vendor("ChefStore", category="silo", domain="procurement", vid="chefstore"),
        vendor("Marginedge Invoice", category="silo", domain="cogs_ap", vid="marginedge-invoice"),
        vendor("Crunchtime Inventory", category="silo", domain="enterprise_ops", vid="crunchtime-inventory"),
        vendor("Harri Hiring", category="silo", domain="hiring", vid="harri-hiring"),
        vendor("Snagajob Restaurant", category="silo", domain="hiring", vid="snagajob"),
        vendor("Indeed Restaurant Hiring", category="silo", domain="hiring", vid="indeed-hiring"),
        vendor("ZipRecruiter Restaurant", category="silo", domain="hiring", vid="ziprecruiter"),
        vendor("Toast Tips Manager", category="silo", domain="payroll", vid="toast-tips"),
        vendor("7shifts Tip Pooling", category="silo", domain="payroll", vid="7shifts-tips"),
        vendor("Push Operations", category="silo", domain="payroll", vid="push-operations"),
        vendor("4dayweek Ops", category="silo", domain="scheduling_labor", vid="4dayweek"),
    ]

    marketplace = [
        vendor("DoorDash", category="marketplace", domain="marketplace_3p", aliases=["Door Dash"], extras=["DoorDash commission too high", "leaving DoorDash", "DoorDash chargebacks"]),
        vendor("Uber Eats", category="marketplace", domain="marketplace_3p", vid="uber-eats", aliases=["UberEats"], extras=["Uber Eats fees killing us"]),
        vendor("Grubhub", category="marketplace", domain="marketplace_3p", aliases=["Grub Hub"], extras=["Grubhub not worth it"]),
        vendor("Postmates", category="marketplace", domain="marketplace_3p"),
        vendor("EzCater", category="marketplace", domain="catering_marketplace", vid="ezcater", aliases=["ezCater"]),
        vendor("Too Good To Go", category="marketplace", domain="surplus_marketplace", vid="tgtg"),
        vendor("HungryPanda", category="marketplace", domain="marketplace_3p"),
        vendor("Fantuan", category="marketplace", domain="marketplace_3p"),
        vendor("Chowbus", category="marketplace", domain="marketplace_3p"),
        vendor("Deliveroo", category="marketplace", domain="marketplace_3p"),
        vendor("Just Eat", category="marketplace", domain="marketplace_3p", vid="just-eat"),
        vendor("SkipTheDishes", category="marketplace", domain="marketplace_3p", vid="skip"),
        vendor("DoorDash Drive", category="marketplace", domain="delivery_logistics", vid="doordash-drive"),
        vendor("Uber Direct", category="marketplace", domain="delivery_logistics", vid="uber-direct"),
        vendor("Relay Delivery", category="marketplace", domain="delivery_logistics", vid="relay"),
        vendor("DoorDash Storefront", category="marketplace", domain="marketplace_storefront", vid="doordash-storefront"),
        vendor("Grubhub Direct", category="marketplace", domain="marketplace_storefront", vid="grubhub-direct"),
        vendor("Caviar", category="marketplace", domain="marketplace_3p"),
        vendor("Seamless", category="marketplace", domain="marketplace_3p"),
        vendor("Uber Eats Manager", category="marketplace", domain="marketplace_3p", vid="uber-eats-manager"),
        vendor("DoorDash Merchant", category="marketplace", domain="marketplace_3p", vid="doordash-merchant"),
        vendor("Grubhub for Restaurants", category="marketplace", domain="marketplace_3p", vid="grubhub-merchants"),
    ]

    ordering = [
        vendor("Toast Online Ordering Module", category="ordering", domain="first_party_ordering", vid="toast-ooo"),
        vendor("Square Online Dining", category="ordering", domain="first_party_ordering", vid="square-online"),
        vendor("Clover Dining Online", category="ordering", domain="first_party_ordering", vid="clover-online"),
        vendor("SpotOn Online Ordering", category="ordering", domain="first_party_ordering", vid="spoton-online"),
        vendor("BentoBox", category="ordering", domain="first_party_ordering", vid="bentobox", aliases=["Bento Box"]),
        vendor("Flipdish", category="ordering", domain="first_party_ordering"),
        vendor("Ordermark", category="ordering", domain="delivery_aggregation"),
        vendor("Menufy", category="ordering", domain="first_party_ordering"),
        vendor("Beyond Menu", category="ordering", domain="first_party_ordering", vid="beyond-menu"),
        vendor("Grubhub Seamless Ordering", category="ordering", domain="marketplace_ordering", vid="seamless-ordering"),
        vendor("Wishbone", category="ordering", domain="first_party_ordering"),
        vendor("Incentivio Ordering", category="ordering", domain="first_party_ordering", vid="incentivio"),
    ]

    loyalty = [
        vendor("Belly Loyalty", category="loyalty", domain="loyalty_crm", vid="belly"),
        vendor("Stamp Me", category="loyalty", domain="loyalty_crm", vid="stamp-me"),
        vendor("LoyaltyLion", category="loyalty", domain="loyalty_crm", vid="loyaltylion"),
        vendor("Annex Cloud", category="loyalty", domain="loyalty_crm", vid="annex-cloud"),
        vendor("Antavo", category="loyalty", domain="loyalty_crm"),
        vendor("SessionM", category="loyalty", domain="loyalty_crm"),
        vendor("Sparkfly", category="loyalty", domain="loyalty_crm"),
        vendor("LikeCard", category="loyalty", domain="gift_loyalty", vid="likecard"),
        vendor("Paytronix Loyalty", category="loyalty", domain="loyalty_crm", vid="paytronix-loyalty"),
        vendor("Punchh Enterprise", category="loyalty", domain="loyalty_crm", vid="punchh-enterprise"),
        vendor("Thanx CRM", category="loyalty", domain="loyalty_crm", vid="thanx-crm"),
        vendor("Fishbowl Loyalty", category="loyalty", domain="loyalty_crm", vid="fishbowl-loyalty"),
    ]

    reservations = [
        vendor("Bookatable", category="reservations", domain="reservations"),
        vendor("Quandoo", category="reservations", domain="reservations"),
        vendor("CoverManager", category="reservations", domain="reservations", vid="covermanager"),
        vendor("TheFork", category="reservations", domain="reservations", vid="thefork"),
        vendor("Eat App", category="reservations", domain="reservations", vid="eatapp"),
        vendor("Tablein", category="reservations", domain="reservations"),
        vendor("Reservision", category="reservations", domain="reservations"),
        vendor("TableAgent", category="reservations", domain="reservations", vid="tableagent"),
        vendor("Waitlist.me Pro", category="reservations", domain="waitlist", vid="waitlistme-pro"),
        vendor("Yelp Waitlist", category="reservations", domain="waitlist", vid="yelp-waitlist"),
    ]

    payments = [
        vendor("Worldpay Restaurant", category="payments", domain="payments", vid="worldpay"),
        vendor("Chase Merchant Services", category="payments", domain="payments", vid="chase-merchant"),
        vendor("Stripe Terminal Restaurant", category="payments", domain="payments", vid="stripe-terminal"),
        vendor("Adyen Restaurant", category="payments", domain="payments", vid="adyen"),
        vendor("Toast Payments", category="payments", domain="payments", vid="toast-payments", extras=["Toast payment processing rates"]),
        vendor("Square Payments Restaurant", category="payments", domain="payments", vid="square-payments"),
        vendor("Shift4 Payments", category="payments", domain="payments", vid="shift4-payments"),
        vendor("CardConnect Restaurant", category="payments", domain="payments", vid="cardconnect"),
        vendor("Elavon Restaurant", category="payments", domain="payments", vid="elavon"),
        vendor("Clover Payments", category="payments", domain="payments", vid="clover-payments"),
        vendor("Helcim Restaurant", category="payments", domain="payments", vid="helcim"),
        vendor("Payment Depot Restaurant", category="payments", domain="payments", vid="payment-depot"),
    ]

    reputation = [
        vendor("Google Business Profile Ops", category="reputation", domain="reputation", vid="gbp", aliases=["Google reviews restaurant"]),
        vendor("Yelp for Business", category="reputation", domain="reputation", vid="yelp-business", extras=["Yelp extortion restaurant"]),
        vendor("TripAdvisor Restaurant", category="reputation", domain="reputation", vid="tripadvisor"),
        vendor("NiceJob", category="reputation", domain="reputation", vid="nicejob"),
        vendor("Grade.us", category="reputation", domain="reputation", vid="grade-us"),
        vendor("Reputation.com Restaurant", category="reputation", domain="reputation", vid="reputation-com"),
        vendor("BirdEye Restaurant", category="reputation", domain="reputation", vid="birdeye-rest"),
        vendor("Podium Reviews", category="reputation", domain="reputation", vid="podium-reviews"),
    ]

    thematic = [
        {"id": "labor", "label": "Labor / staffing (cross-vendor)", "file": "thematic/labor.json"},
        {"id": "cost", "label": "Cost / fees / margins (cross-vendor)", "file": "thematic/cost.json"},
        {"id": "drift", "label": "Menu / price / data drift", "file": "thematic/drift.json"},
        {"id": "marketplace_3p_bundle", "label": "3P bundle hate (DD+UE+GH together)", "file": "thematic/marketplace-3p.json"},
        {"id": "stack_sprawl", "label": "Frankenstein stack / too many vendors", "file": "thematic/stack-sprawl.json"},
        {"id": "chargebacks", "label": "Chargebacks / fake orders / fraud", "file": "thematic/chargebacks.json"},
        {"id": "hardware_lockin", "label": "Hardware lease / lock-in traps", "file": "thematic/hardware-lockin.json"},
        {"id": "integration_hell", "label": "Integration hell / nothing syncs", "file": "thematic/integration-hell.json"},
    ]

    return {
        "version": "2.0.0",
        "platform": "Never86",
        "swarm_mode": True,
        "purpose": (
            "Swarm vendor map for Never86 pain-shopper agents. One agent per POS, silo, "
            "marketplace, ordering, loyalty, reservations, payments, and reputation vendor."
        ),
        "pos_vendors": dedupe(pos),
        "silo_vendors": dedupe(silo),
        "marketplace_vendors": dedupe(marketplace),
        "ordering_vendors": dedupe(ordering),
        "loyalty_vendors": dedupe(loyalty),
        "reservations_vendors": dedupe(reservations),
        "payments_vendors": dedupe(payments),
        "reputation_vendors": dedupe(reputation),
        "thematic": thematic,
        "learning": {
            "complaint_signals": [
                "fuck {vendor}",
                "leaving {vendor}",
                "switching off {vendor}",
                "{vendor} crashed",
                "{vendor} fees",
                "{vendor} lock-in",
                "{vendor} support",
                "replacing {vendor}",
                "{vendor} nightmare",
                "{vendor} commission",
                "{vendor} chargeback",
            ],
            "at_scale": "Per-vendor phrase/alias banks from teach labels → sharper complaint ID → more Never86 buyers.",
        },
    }


def agent_doc(v: dict, color: str) -> dict:
    category = v["category"]
    name = v["name"]
    vendor_id = v["id"]
    domain = v.get("domain")
    legal = v.get("legal", name)

    titles = {
        "pos": f"Never86 lead shopper — {name} POS complaints",
        "silo": f"Never86 lead shopper — {name} silo complaints",
        "marketplace": f"Never86 lead shopper — {name} marketplace pain",
        "ordering": f"Never86 lead shopper — {name} ordering pain",
        "loyalty": f"Never86 lead shopper — {name} loyalty/CRM pain",
        "reservations": f"Never86 lead shopper — {name} reservations pain",
        "payments": f"Never86 lead shopper — {name} payments pain",
        "reputation": f"Never86 lead shopper — {name} reputation pain",
    }

    description = (
        f"Swarm agent for Never86. Scans TikTok, Reddit, Facebook groups, X, and operator forums "
        f"for restaurants/GMs/owners complaining about {name} ({legal}). Learns complaint language "
        f"at scale. Shops identity + full complaint context, teach/labels with Myke, recurse-learns, "
        f"automates Never86 sales leads. Never outreaches without approval."
    )
    if domain:
        description += f" Domain focus: {domain}."

    return {
        "name": f"{name} Pain Shopper",
        "title": titles.get(category, f"Never86 lead shopper — {name}"),
        "shape": "fox",
        "color": color,
        "family": "never86-pain-shoppers",
        "vendor_id": vendor_id,
        "pain_id": f"{category}_{vendor_id}",
        "category": category,
        "domain": domain,
        "legal_name": legal,
        "aliases": v.get("aliases", []),
        "rank": v.get("rank"),
        "version": "2.0.0",
        "owner": "mykemueller1-ctrl",
        "description": description,
        "seed_queries": v.get("seed_queries", []),
        "icp_hints": [
            "independent or multi-unit restaurant operators",
            "GM / owner / ops / back-office voice",
            f"explicit {name} / alias mention",
            "active complaint in last 90 days",
            "US markets first",
        ],
        "learning": {
            "track_aliases": True,
            "track_complaint_phrases": True,
            "displace_narrative": f"Operator hate on {name} → Never86 wedge",
        },
        "swarm": True,
    }


THEMATIC_NEW = {
    "stack-sprawl": {
        "name": "Stack Sprawl Pain Shopper",
        "pain_id": "stack_sprawl",
        "description": "Finds operators drowning in too many restaurant vendors — frankenstein stacks, double entry, nothing talks. Shops leads for Never86 consolidation wedge.",
        "seed_queries": [
            "too many restaurant apps",
            "restaurant tech stack nightmare",
            "we pay for 8 apps that don't sync",
            "siloed restaurant software",
            "integration hell restaurant",
        ],
    },
    "chargebacks": {
        "name": "Chargebacks Fraud Pain Shopper",
        "pain_id": "chargebacks",
        "description": "Finds restaurants hit by fake orders, chargebacks, friendly fraud, and delivery theft. Shops Never86 leads around owned-channel trust.",
        "seed_queries": [
            "DoorDash fake order chargeback",
            "restaurant chargeback fraud",
            "Uber Eats fraudulent order",
            "delivery order never picked up chargeback",
        ],
    },
    "hardware-lockin": {
        "name": "Hardware Lock-in Pain Shopper",
        "pain_id": "hardware_lockin",
        "description": "Finds operators trapped in POS hardware leases, early termination fees, and equipment lock-in. Shops Never86 leads on escape / owned commerce.",
        "seed_queries": [
            "POS hardware lease trap",
            "Toast equipment contract",
            "restaurant POS early termination fee",
            "can't leave POS hardware lock-in",
        ],
    },
    "integration-hell": {
        "name": "Integration Hell Pain Shopper",
        "pain_id": "integration_hell",
        "description": "Finds operators screaming that POS, 3P, inventory, and accounting don't sync. Shops Never86 leads on unified social-commerce rail.",
        "seed_queries": [
            "POS doesn't sync with DoorDash",
            "menu out of sync integrations",
            "restaurant API integration failed",
            "double entering orders every night",
        ],
    },
}


def write_thematic(thematic: list[dict]) -> None:
    thematic_dir = ROOT / "thematic"
    thematic_dir.mkdir(parents=True, exist_ok=True)
    for t in thematic:
        fname = Path(t["file"]).name
        path = thematic_dir / fname
        key = fname.replace(".json", "")
        if key in THEMATIC_NEW:
            s = THEMATIC_NEW[key]
            doc = {
                "name": s["name"],
                "title": f"Never86 lead shopper — {s['pain_id']}",
                "shape": "fox",
                "color": "#264653",
                "family": "never86-pain-shoppers",
                "pain_id": s["pain_id"],
                "category": "thematic",
                "version": "2.0.0",
                "owner": "mykemueller1-ctrl",
                "description": s["description"],
                "seed_queries": s["seed_queries"],
                "icp_hints": ["operator voice", "US first", "active pain last 90 days"],
                "swarm": True,
            }
            path.write_text(json.dumps(doc, indent=2) + "\n")
        elif path.exists():
            doc = json.loads(path.read_text())
            doc["category"] = "thematic"
            doc["version"] = "2.0.0"
            doc["swarm"] = True
            path.write_text(json.dumps(doc, indent=2) + "\n")


def regenerate(catalog: dict) -> None:
    buckets = [
        ("pos", "pos_vendors", ROOT / "pos"),
        ("silo", "silo_vendors", ROOT / "silo"),
        ("marketplace", "marketplace_vendors", ROOT / "marketplace"),
        ("ordering", "ordering_vendors", ROOT / "ordering"),
        ("loyalty", "loyalty_vendors", ROOT / "loyalty"),
        ("reservations", "reservations_vendors", ROOT / "reservations"),
        ("payments", "payments_vendors", ROOT / "payments"),
        ("reputation", "reputation_vendors", ROOT / "reputation"),
    ]

    family_agents: dict[str, list] = {}
    total = 0

    for cat, key, directory in buckets:
        directory.mkdir(parents=True, exist_ok=True)
        for old in directory.glob("*.json"):
            old.unlink()
        agents = []
        colors = COLORS[cat]
        for i, v in enumerate(catalog[key]):
            doc = agent_doc(v, colors[i % len(colors)])
            path = directory / f"{v['id']}.json"
            path.write_text(json.dumps(doc, indent=2) + "\n")
            agents.append(
                {
                    "id": v["id"],
                    "file": f"{cat}/{v['id']}.json",
                    "pain": f"{cat}_{v['id']}",
                    "label": v["name"],
                    "domain": v.get("domain"),
                    "rank": v.get("rank"),
                }
            )
            total += 1
        family_agents[f"{cat}_agents"] = agents
        print(f"{cat}: {len(agents)} agents")

    write_thematic(catalog["thematic"])

    family = {
        "family": "never86-pain-shoppers",
        "platform": "Never86",
        "version": "2.0.0",
        "swarm_mode": True,
        "purpose": (
            "SWARM: shop Never86 buyers by hunting operator complaints across every major POS, "
            "silo, marketplace, ordering, loyalty, reservations, payments, and reputation vendor."
        ),
        "shop_means": (
            "Collect identity + complaint context. Owner teaches per vendor; agents recurse and "
            "auto-fill sales forms. Outreach stays approval-gated."
        ),
        "vendor_catalog": "vendors/catalog.json",
        "agent_count": total + len(catalog["thematic"]),
        "sources": ["tiktok", "instagram", "reddit", "facebook_groups", "x", "forums", "discord", "linkedin"],
        "shared_skills": [
            "pain-complaint-scan",
            "lead-shop-enrich",
            "teach-label",
            "recurse-learn",
            "sales-lead-form",
            "vendor-complaint-learn",
        ],
        **family_agents,
        "thematic_agents": catalog["thematic"],
        "approval_required_for": ["outreach", "dm", "email", "comment", "spend", "publish"],
    }
    (ROOT / "family.json").write_text(json.dumps(family, indent=2) + "\n")
    print(f"TOTAL vendor agents: {total}")
    print(f"TOTAL with thematic: {family['agent_count']}")


def main() -> None:
    catalog = build_catalog()
    CATALOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    CATALOG_PATH.write_text(json.dumps(catalog, indent=2) + "\n")
    print(f"wrote catalog → {CATALOG_PATH}")
    counts = {k: len(catalog[k]) for k in catalog if k.endswith("_vendors") or k == "thematic"}
    print("counts:", counts)
    regenerate(catalog)


if __name__ == "__main__":
    main()
