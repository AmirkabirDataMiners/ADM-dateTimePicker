var primaries = app.factory('primaries', function() {
   return {
     
       urls: {
            baseUrl: '',
            baseAssetsUrl: '',
            baseUploadUrl: '',
       },
       
       estateTypes: [
           {id:'APARTMENT',name:'آپارتمان',eName:'apartment'},
           {id:'EDARI',name:'اداری',eName:'office'},
           {id:'VILA',name:'خانه و ویلایی',eName:'villa'},
           {id:'KOLANGI',name:'کلنگی',eName:'aging'},
           {id:'ZAMIN',name:'زمین',eName:'ground'},
           {id:'MAGHAZE',name:'مغازه',eName:'store'},
           {id:'BAAGH',name:'باغ',eName:'garden'},
           {id:'BAAGHVILA',name:'باغ ویلا',eName:'gardenVilla'},
        ], //DONE
    
       transactionTypes: [
            {id:'1',name:'فروش'},
            {id:'2',name:'پیش فروش'},
           {id:'MOAVEZE',name:'معاوضه'},
           {id:'EJARE',name:'رهن و اجاره'},
        ], //foroosh va pish_foroosh 
       
       transactionTypesClient: [
           {id:'KHARID',name:'خرید'},
           {id:'EJARE',name:'رهن و اجاره'},
           {id:'PISHKHARID',name:'پیش خرید'},
           {id:'MOAVEZE',name:'معاوضه'},
        ], //DONE
       
       cupboardTypes: [
           {id:'UNKNOWN', name: 'نامشخص'},
           {id:'HASNOT', name: 'ندارد'},
           {id:'MDF', name: 'MDF'},
           {id:'HIGLASS', name: 'هایگلاس'},
           {id:'METAL', name: 'فلزی'},
           {id:'WOOD', name: 'تمام چوب'},
           {id:'HDF', name: 'HDF'},
           {id:'MELAMINE', name: 'ملامینه'},
           {id:'HPL', name: 'HPL'},
           {id:'POLYWOOD', name: 'پلی­ وود'},
           {id:'NEOPAN', name: 'نئوپان'},
           {id:'PVC', name: 'PVC'},
           {id:'METALWOOD', name: 'چوبی فلزی'},
           {id:'STONE', name: 'سنگ'},
           {id:'FORMIKA', name: 'فورمیکا'},
           {id:'FIBERGLASS', name: 'فایبرگلاس'},
       ], //DONE
       
       wcTypes: [
           {id:'IRANI', name: 'ایرانی'},
           {id:'FARANGI', name: 'فرنگی'},
           {id:'UNKNOWN', name: 'نا مشحص'},
       ], //DONE
       
       floorCoveringTypes: [
           {id:'UNKNOWN', name: 'نامشخص'},
           {id:'PARKET', name: 'پارکت'},
           {id:'SERAMIK', name: 'سرامیک'},
           {id:'SANG', name: 'سنگ'},
           {id:'MOKET', name: 'موکت'},
           {id:'MOZAIK', name: 'موزاییک'},
           {id:'SIMAN', name: 'سیمان'},
           {id:'GRANIT', name: 'گرانیت'},
           {id:'TAKSERAM', name: 'تک­سرام'},
           {id:'LAMINATE', name: 'لمینت'},
           {id:'KASHI', name: 'کاشی'},
           {id:'KAFPOOSH', name: 'کفپوش'},
           {id:'BRONZ', name: 'برنز'},
           {id:'HDF', name: 'HDF'},
       ], //DONE
       
       estateDirections: [
           {id:'SHOMALI', name: 'شمالی'},
           {id:'JONOOBI', name: 'جنوبی'},
           {id:'SHARGHI', name: 'شرقی'},
           {id:'GHARBI', name: 'غربی'},
       ], //DONE
       
       frontageTypes: [
           {id:'SANG', name: 'سنگ'},
           {id:'TARKIBI', name: 'ترکیبی'},
           {id:'AJOR_3SANT', name: 'آجر سه سانت'},
           {id:'AJOR_SOFAL', name: 'آجر سفال'},
           {id:'AJOR_NAMA', name: 'آجر نما'},
           {id:'AJOR_GREY', name: 'آجر گری'},
           {id:'SHISHE_SEKORIT', name: 'شیشه سکوریت'},
           {id:'ROOMI', name: 'رومی'},
           {id:'SIMAN', name: 'سیمان'},
           {id:'SANG_SHISHE', name: 'سنگ و شیشه'},
           {id:'SHISHE_REFLEX', name: 'شیشه رفلکس'},
           {id:'ALOMINUM', name: 'آلومینیوم'},
           {id:'TRAVERTAN', name: 'تراورتن'},
           {id:'COMPOZIT', name: 'کامپوزیت'},
           {id:'GRANOLIT', name: 'گرانولیت'},
           {id:'SERAMIC', name: 'سرامیک'},
           {id:'ALOTILE', name: 'آلوتایل'},
           {id:'ROMALIN', name: 'رومالین'},
           {id:'SIMAN_SEFID', name: 'سیمان سفید'},
           {id:'SIMAN_RANGI', name: 'سیمان رنگی'},
           {id:'GRANIT', name: 'گرانیت'},
           {id:'KENITEX', name: 'کنیتکس'},
           {id:'CHOOB', name: 'چوب'},
       ], //DONE
       
       documentStates: [
           {id:'SHAKHSI', name: 'شخصی'},
           {id:'GHOLNAMEI', name: 'قول­نامه­ای'},
           {id:'OGHAFI', name: 'اوقافی'},
           {id:'TAVONI', name: 'تعاونی'},
           {id:'BONYADI', name: 'بنیادی'},
           {id:'EDARI', name: 'اداری'},
           {id:'VEKALATI', name: 'وکالتی'},
           {id:'ZAMINSHAHRI', name: 'زمین شهری'},
           {id:'TEJARI', name: 'تجاری'},
           {id:'BONCHAGH', name: 'بنچاق'},
           {id:'MOBAYENAME', name: 'مبایعه­نامه'},
           {id:'HAKEMSHARI', name: 'حاکم شرعی'},
           {id:'MOSHA', name: 'مشاع'},
           {id:'DARDASTEGHDAM', name: 'در دست اقدام'},
           {id:'MANGOLEDR', name: 'منگوله­دار'},
           {id:'GHARARDADI', name: 'قراردادی'},
           {id:'SANAYEDEFA', name: 'صنایع دفاع'},
           {id:'SHAHRDARI', name: 'شهرداری'},
           {id:'AMADEMAHZAR', name: 'آماده محضر'},
           {id:'BAGHCHE', name: 'باغچه'},
           {id:'SOLHNAME', name: 'صلح­نامه­ای'},
           {id:'TEJARI_SANAT', name: 'تجاری-صنعت'},
           {id:'DASTEAVAL', name: 'دست اول'},
           {id:'BEITERAHBARI', name: 'بیت رهبری'},
           {id:'AYAN', name: 'اعیان'},
           {id:'BARGEHAKEM', name: 'برگه حاکم'},
           {id:'SETADEJRAI', name: 'ستاد اجرایی'},
           {id:'SHORAYI', name: 'شورایی'},
           {id:'SAZMANI', name: 'سازمانی'},
           {id:'MASKOONI', name: 'مسکونی'},
           {id:'AMOZESHI', name: 'آموزشی'},
           {id:'SANATI', name: 'صنعتی'},
           {id:'KARGAHI', name: 'کارگاهی'},
       ], //DONE
       
       estateStates: [
           {id:'TAKHLIE', name: 'تخلیه'},
           {id:'EJARE', name: 'اجاره'},
           {id:'MALEKSAKEN', name: 'سکونت مالک'},
           {id:'VAGOZAR', name: 'واگذار شده'},
           {id:'DARHALESAKHT', name: 'در حال ساخت'},
       ], //DONE
       
       densities: [
           {id:'KAM', name: 'کم'},
           {id:'MEDIUM', name: 'متوسط'},
           {id:'ZIAD', name: 'زیاد'},
       ], //DONE
       
       agingApplicationTypes: [
           {id:'MASKOONI', name: 'مسکونی'},
           {id:'EDARI', name: 'اداری'},
           {id:'TEJARI', name: 'تجاری'},
           {id:'AMOZESHI', name: 'آموزشی'},
           {id:'VARZESHI', name: 'ورزشی'},
           {id:'KHADAMATI', name: 'خدماتی'},
       ], //DONE
       
       groundApplicationTypes: [
           {id:'MASKOONI', name: 'مسکونی'},
           {id:'EDARI', name: 'اداری'},
           {id:'TEJARI', name: 'تجاری'},
           {id:'AMOZESHI', name: 'آموزشی'},
           {id:'VARZESHI', name: 'ورزشی'},
           {id:'KHADAMATI', name: 'خدماتی'},
           {id:'SANATI', name: 'صنعتی'},
           {id:'ZERAI', name: 'زراعی'},
           {id:'DAMOTIOR', name: 'دام و طیور'},
       ], //DONE
       
       waterShareUnits: [
            {id:'1', name: 'ساعت'},
            {id:'2', name: 'روز'},
            {id:'3', name: 'هفته'},
            {id:'4', name: 'ماه'},
        ],
       
       waterShareInUnits: [
            {id:'1', name: 'روز'},
            {id:'2', name: 'هفته'},
            {id:'3', name: 'ماه'},
            {id:'4', name: 'سال'},
        ],
       
       unitFloors: [
            {id:'1', name: 'طبقه -2'},{id:'2', name: 'زیرزمین'},{id:'3', name: 'همکف'},{id:'4', name: 'طبقه 1'},{id:'5', name: 'طبقه 2'},{id:'6', name: 'طبقه 3'},{id:'7', name: 'طبقه 4'},{id:'8', name: 'طبقه 5'},{id:'9', name: 'طبقه 6'},{id:'10', name: 'طبقه 7'},{id:'11', name: 'طبقه 8'},{id:'12', name: 'طبقه 9'},{id:'13', name: 'طبقه 10'},{id:'14', name: 'طبقه 11'},{id:'15', name: 'طبقه 12'},{id:'16', name: 'طبقه 13'},{id:'17', name: 'طبقه 14'},{id:'18', name: 'طبقه 15'},{id:'19', name: 'طبقه 16'},{id:'20', name: 'طبقه 17'},{id:'21', name: 'طبقه 18'},{id:'22', name: 'طبقه 19'},{id:'23', name: 'طبقه 20'},{id:24, name: 'طبقه 21'},{id:25, name: 'طبقه 22'},{id:26, name: 'طبقه 23'},{id:27, name: 'طبقه 24'},{id:28, name: 'طبقه 25'},{id:29, name: 'طبقه 26'},{id:30, name: 'طبقه 27'},{id:31, name: 'طبقه 28'},{id:32, name: 'طبقه 29'},{id:'33', name: 'طبقه 30'},{id:34, name: 'طبقه 31'},{id:35, name: 'طبقه 32'},{id:36, name: 'طبقه 33'},{id:37, name: 'طبقه 34'},{id:38, name: 'طبقه 35'},{id:39, name: 'طبقه 36'},{id:40, name: 'طبقه 37'},{id:41, name: 'طبقه 38'},{id:42, name: 'طبقه 39'},{id:43, name: 'طبقه 40'},{id:44, name: 'طبقه 41'},{id:45, name: 'طبقه 42'},{id:46, name: 'طبقه 43'},{id:47, name: 'طبقه 44'},{id:48, name: 'طبقه 45'},{id:49, name: 'طبقه 46'},{id:50, name: 'طبقه 47'},{id:51, name: 'طبقه 48'},{id:52, name: 'طبقه 49'},{id:53, name: 'طبقه 50'},{id:54, name: 'طبقه 51'},{id:55, name: 'طبقه 52'},{id:56, name: 'طبقه 53'},{id:57, name: 'طبقه 54'},{id:58, name: 'طبقه 55'},{id:59, name: 'طبقه 56'},{id:60, name: 'طبقه 57'},{id:61, name: 'طبقه 58'},{id:62, name: 'طبقه 59'},{id:63, name: 'طبقه 60'},
       ],
       
       heatingAndCoolingEquipments: [
           {id:'CHILER', name:'چیلر'},
           {id:'KOOLER_ABI', name:'کولر آبی'},
           {id:'KOOLER_GAZI', name:'کولر گازی'},
           {id:'FANKOEL', name:'فن کوئل'},
           {id:'PAKAGE', name:'پکیج'},
           {id:'SHOFAZH', name:'شوفاژ'},
           {id:'GAZ', name:'گاز'},
           {id:'GARMAYESH_AZ_KAF', name:'گرمایش از کف'},
        ], //DONE
       
       apartmentMainFeatures: [
           {id:'PARKING', name:'پارکینگ'},
           {id:'ASANSOR', name:'آسانسور'},
           {id:'ANBARI', name:'انباری'},
           {id:'BALKON', name:'بالکن'},
           {id:'OPENKITCHEN', name:'آشپزخانه OPEN'},       
       ], //DONE
       
       storeMainFeatures: [
           {id:'PARKING', name:'پارکینگ'},
           {id:'ASANSOR', name:'آسانسور'},
           {id:'ANBARI', name:'انباری'},
           {id:'BALKON', name:'بالکن'},
           {id:'ABDARKHANE', name:'آبدارخانه'},
        ], //DONE
       
       gardenMainFeatures: [
           {id:'AB', name:'آب'},
           {id:'BARGH', name:'برق'},
           {id:'GAZ', name:'گاز'},
           {id:'CHAH', name:'چاه آب'},
           {id:'DAR_MASHINRO', name:'درب ماشین رو'},
           {id:'ASFALT_2JADE', name:'متصل به راه آسفالت'},
           {id:'HOME_SERAIDAR', name:'خانه سرایداری'},
           {id:'MOJAVZ_SAKHT', name:'مجوز ساخت'},
        ], //DONE
       
       gardenVillaMainFeatures: [
           {id:'AB', name:'آب'},
           {id:'BARGH', name:'برق'},
           {id:'GAZ', name:'گاز'},
           {id:'CHAH', name:'چاه آب'},
           {id:'PARKING', name:'پارکینگ'},
           {id:'ASFALT_2JADE', name:'متصل به راه آسفالت'},
           {id:'HOME_SERAIDAR', name:'خانه سرایداری'},
           {id:'ALACHIGH', name:'آلاچیق'},
           {id:'ABNAMA', name:'آبنما'},
           {id:'ESTAKHR', name:'استخر'},
           {id:'SONA', name:'سونا'},
           {id:'CHAKOZI', name:'جکوزی'},
        ], //DONE
       
       apartmentSideFeatures: [
           {id:'HAYAT', name:'حیاط'},
           {id:'HAYAT_KHALVAT', name:'حیاط خلوت'},
           {id:'PASIO', name:'پاسیو'},
           {id:'SERAIDAR', name:'سرایدار'},
           {id:'ZIRZAMIN', name:'زیرزمین'},     
       ], //DONE
       
       storeSideFeatures: [
           {id:'VITRIN', name:'ویترین'},
           {id:'GHAFASE', name:'قفسه'},
           {id:'DOZDGIR', name:'دزدگیر'},
           {id:'KERKERE_BARGHI', name:'کرکره برقی'},   
       ], //DONE
       
       specialLabels: [
            {id:'1',name:'شرایط مالی ویژه', enable:'false'},
            {id:'2',name:'اوکازیون', enable:'true'},
            {id:'3',name:'فوی (پول‌لازم)', enable:'true'},
            {id:'4',name:'به‌قیمت‌رسیده', enable:'true'},
            {id:'5',name:'مناسب سرمایه‌گذاری', enable:'true'},
            {id:'6',name:'قدرالسهم', enable:'true'},
            {id:'7',name:'پرداخت اقساطی', enable:'true'},
            {id:'8',name:'شرایط مکانی ویژه', enable:'false'},
            {id:'9',name:'محله دنج', enable:'true'},
            {id:'10',name:'بهترین فرعی محله', enable:'true'},
            {id:'11',name:'دسترسی عالی', enable:'true'},
            {id:'12',name:'چشم‌انداز (ویو) عالی', enable:'true'},
            {id:'13',name:'دوبر', enable:'true'},
            {id:'14',name:'سه بر', enable:'true'},
            {id:'15',name:'دوکله', enable:'true'},
            {id:'16',name:'شرایط داخلی ویژه', enable:'false'},
            {id:'17',name:'نورگیر عالی ', enable:'true'},
            {id:'18',name:'با کلیه امکانات', enable:'true'},
            {id:'19',name:'بازسازی‌شده', enable:'true'},
            {id:'2',name:'خوش‌نقشه', enable:'true'},
            {id:'21',name:'فروش', enable:'true'},
            {id:'22',name:'متریال عالی (برند)', enable:'true'},
            {id:'23',name:'لوکس', enable:'true'},
            {id:24,name:'شخصی‌ساز', enable:'true'},
            {id:25,name:'آشپزخانه فرنیش', enable:'true'},
            {id:26,name:'فرنیش', enable:'true'},
            {id:27,name:'تراس وسیع', enable:'true'},
            {id:28,name:'دوبلکس', enable:'true'},
            {id:29,name:'فرنیش', enable:'true'},
            {id:30,name:'دارای امکانات ویژه', enable:'false'},
            {id:31,name:'حیاط خلوت', enable:'true'},
            {id:32,name:'2+ پارکینگ', enable:'true'},
            {id:'33',name:'مشاعات عالی', enable:'true'},
            {id:34,name:'لابی مجلل', enable:'true'},
            {id:35,name:'سالن اجتماعات', enable:'true'},
            {id:36,name:'سونا و جکوزی', enable:'true'},
            {id:37,name:'استخر', enable:'true'},
            {id:38,name:'سالن سینما', enable:'true'},
            {id:39,name:'باشگاه', enable:'true'},
            {id:40,name:'روف گاردن', enable:'true'},
        ],
       
       registerAdvTimes: [
            {id:'1', name:'1 روز'},
            {id:'2', name:'3 روز'},
            {id:'3', name:'1 هفته'},
            {id:'4', name:'1 ماه'},
            {id:'5', name:'1 سال'},
            {id:'6', name:'بیشتر از 1 سال'},
        ],
       
   }
});

var global = app.factory('global',function(primaries){
    return {
     
        apartment: {
            estateInformaion: {
                unitFloors: primaries.unitFloors,
                cupboardTypes: primaries.cupboardTypes,
                wcTypes: primaries.wcTypes,
                floorCoveringTypes: primaries.floorCoveringTypes,
                estateDirections: primaries.estateDirections,
                frontageTypes: primaries.frontageTypes,
                documentStates: primaries.documentStates,
                estateStates: primaries.estateStates,
            },
            features: {
                mainFeatures: primaries.apartmentMainFeatures,
                sideFeatures: primaries.apartmentSideFeatures,
                heatingAndCoolingEquipments: primaries.heatingAndCoolingEquipments,
            },
            estateDescription: '',
            estateImages: {
                defaultImage: 'facade'
            }
        },

        office: {
            estateInformaion: {
                unitFloors: primaries.unitFloors,
                cupboardTypes: primaries.cupboardTypes,
                wcTypes: primaries.wcTypes,
                floorCoveringTypes: primaries.floorCoveringTypes,
                estateDirections: primaries.estateDirections,
                frontageTypes: primaries.frontageTypes,
                documentStates: primaries.documentStates,
                estateStates: primaries.estateStates,
            },
            features: {
                mainFeatures: primaries.storeMainFeatures,
                sideFeatures: primaries.apartmentSideFeatures,
                heatingAndCoolingEquipments: primaries.heatingAndCoolingEquipments,
            },
            estateDescription: '',
            estateImages: {
                defaultImage: 'facade'
            }
        },

        villa: {
            estateInformaion: {
                cupboardTypes: primaries.cupboardTypes,
                wcTypes: primaries.wcTypes,
                floorCoveringTypes: primaries.floorCoveringTypes,
                estateDirections: primaries.estateDirections,
                frontageTypes: primaries.frontageTypes,
                documentStates: primaries.documentStates,
                estateStates: primaries.estateStates,
                densities: primaries.densities,
            },
            features: {
                mainFeatures: primaries.apartmentMainFeatures,
                sideFeatures: primaries.apartmentSideFeatures,
                heatingAndCoolingEquipments: primaries.heatingAndCoolingEquipments,
            },
            estateDescription: '',
            estateImages: {
                defaultImage: 'facade'
            }
        },

        aging: {
            estateInformaion: {
                cupboardTypes: primaries.cupboardTypes,
                wcTypes: primaries.wcTypes,
                floorCoveringTypes: primaries.floorCoveringTypes,
                estateDirections: primaries.estateDirections,
                frontageTypes: primaries.frontageTypes,
                documentStates: primaries.documentStates,
                estateStates: primaries.estateStates,
                densities: primaries.densities,
                applicationTypes: primaries.agingApplicationTypes,
            },
            features: {
                mainFeatures: primaries.apartmentMainFeatures,
                sideFeatures: primaries.apartmentSideFeatures,
                heatingAndCoolingEquipments: primaries.heatingAndCoolingEquipments,
            },
            estateDescription: '',
            estateImages: {
                defaultImage: 'facade'
            }
        },

        ground: {
            estateInformaion: {
                estateDirections: primaries.estateDirections,
                documentStates: primaries.documentStates,
                densities: primaries.densities,
                applicationTypes: primaries.groundApplicationTypes,
            },
            estateDescription: '',
            estateImages: {
                defaultImage: 'facade'
            }
        },

        store: {
            estateInformaion: {
                unitFloors: primaries.unitFloors,
                wcTypes: primaries.wcTypes,
                floorCoveringTypes: primaries.floorCoveringTypes,
                estateDirections: primaries.estateDirections,
                frontageTypes: primaries.frontageTypes,
                documentStates: primaries.documentStates,
                estateStates: primaries.estateStates,
            },
            features: {
                mainFeatures: primaries.storeMainFeatures,
                sideFeatures: primaries.storeSideFeatures,
                heatingAndCoolingEquipments: primaries.heatingAndCoolingEquipments,
            },
            estateDescription: '',
            estateImages: {
                defaultImage: 'facade'
            }
        },

        garden: {
            estateInformaion: {
                estateDirections: primaries.estateDirections,
                documentStates: primaries.documentStates,
                waterShareUnits: primaries.waterShareUnits,
                waterShareInUnits: primaries.waterShareInUnits,
            },
            features: {
                mainFeatures: primaries.gardenMainFeatures,
            },
            estateDescription: '',
            estateImages: {
                defaultImage: 'facade'
            }
        },

        gardenVilla: {
            estateInformaion: {
                cupboardTypes: primaries.cupboardTypes,
                wcTypes: primaries.wcTypes,
                floorCoveringTypes: primaries.floorCoveringTypes,
                estateDirections: primaries.estateDirections,
                frontageTypes: primaries.frontageTypes,
                documentStates: primaries.documentStates,
                waterShareUnits: primaries.waterShareUnits,
                waterShareInUnits: primaries.waterShareInUnits,
            },
            features: {
                mainFeatures: primaries.gardenVillaMainFeatures,
                heatingAndCoolingEquipments: primaries.heatingAndCoolingEquipments,
            },
            estateDescription: '',
            estateImages: {
                defaultImage: 'facade'
            }
        },
        
        search: {
            apartment: {
                info: [
                    {type:'fromTo', headerName:'زیربنا', unit:'(به متر مربع)'},
                    {type:'fromTo', headerName:'تعداد اتاق خواب', unit:''},
                    {type:'fromTo', headerName:'سن بنا', unit:'(به سال)'},
                    {type:'fromTo', headerName:'طبقه واحد', unit:''},
                ],
                features: primaries.apartmentMainFeatures,
            },
            villa: {
                info: [
                    {type:'fromTo', headerName:'زیربنا', unit:'(به متر مربع)'},
                    {type:'fromTo', headerName:'تعداد اتاق خواب', unit:''},
                    {type:'fromTo', headerName:'سن بنا', unit:'(به سال)'},
                    {type:'fromTo', headerName:'تعداد طبقات', unit:''},
                ],
                features: primaries.apartmentMainFeatures,
            },
            office: {
                info: [
                    {type:'fromTo', headerName:'زیربنا', unit:'(به متر مربع)'},
                    {type:'fromTo', headerName:'تعداد اتاق', unit:''},
                    {type:'fromTo', headerName:'سن بنا', unit:'(به سال)'},
                    {type:'fromTo', headerName:'طبقه واحد', unit:''},
                ],
                features: primaries.storeMainFeatures,
            },
            store: {
                info: [
                    {type:'fromTo', headerName:'زیربنا', unit:'(به متر مربع)'},
                    {type:'fromTo', headerName:'طول دهانه', unit:'(به متر)'},
                    {type:'fromTo', headerName:'سن بنا', unit:'(به سال)'},
                    {type:'fromTo', headerName:'طبقه واحد', unit:''},
                ],
                features: primaries.storeMainFeatures,
            },
            aging: {
                info: [
                    {type:'fromTo', headerName:'مساحت زمین', unit:'(به متر مربع)'},
                    {type:'fromTo', headerName:'طول بر', unit:'(به متر)'},
                    {type:'dropDown', headerName:'نوع کاربری', data: primaries.agingApplicationTypes,},
                    {type:'fromTo', headerName:'تعداد طبقات'},
                ],
                features: [],
            },
            ground: {
                info: [
                    {type:'fromTo', headerName:'مساحت زمین', unit:'(به متر مربع)'},
                    {type:'fromTo', headerName:'طول بر', unit:'(به متر)'},
                    {type:'dropDown', headerName:'نوع کاربری', data:primaries.groundApplicationTypes,},
                ],
                features: [],
            },
            garden: {
                info: [
                    {type:'fromTo', headerName:'مساحت زمین', unit:'(به متر مربع)'},
                ],
                features: primaries.gardenMainFeatures,
            },
            gardenVilla: {
                info: [
                    {type:'fromTo', headerName:'سن بنا', unit:'(به سال)'},
                    {type:'fromTo', headerName:'زیربنا', unit:'(به متر مربع)'},
                    {type:'fromTo', headerName:'تعداد اتاق خواب', unit:''},
                    {type:'fromTo', headerName:'مساحت زمین', unit:'(به متر مربع)'},
                ],
                features: primaries.gardenVillaMainFeatures,
            },
        },
        
        rentSearch: {
            apartment: {
                info: [
                    {type:'fromTo', headerName:'مبلغ اجاره', unit:'(به تومان)'},
                    {type:'fromTo', headerName:'زیربنا', unit:'(به متر مربع)'},
                    {type:'fromTo', headerName:'تعداد اتاق خواب', unit:''},
                    {type:'fromTo', headerName:'طبقه واحد', unit:''},
                ],
                features: primaries.apartmentMainFeatures,
            },
            villa: {
                info: [
                    {type:'fromTo', headerName:'مبلغ اجاره', unit:'(به تومان)'},
                    {type:'fromTo', headerName:'زیربنا', unit:'(به متر مربع)'},
                    {type:'fromTo', headerName:'تعداد اتاق خواب', unit:''},
                    {type:'fromTo', headerName:'تعداد طبقات', unit:''},
                ],
                features: primaries.apartmentMainFeatures,
            },
            office: {
                info: [
                    {type:'fromTo', headerName:'مبلغ اجاره', unit:'(به تومان)'},
                    {type:'fromTo', headerName:'زیربنا', unit:'(به متر مربع)'},
                    {type:'fromTo', headerName:'تعداد اتاق', unit:''},
                    {type:'fromTo', headerName:'طبقه واحد', unit:''},
                ],
                features: primaries.storeMainFeatures,
            },
            store: {
                info: [
                    {type:'fromTo', headerName:'مبلغ اجاره', unit:'(به تومان)'},
                    {type:'fromTo', headerName:'زیربنا', unit:'(به متر مربع)'},
                    {type:'fromTo', headerName:'طول دهانه', unit:'(به متر)'},
                    {type:'fromTo', headerName:'طبقه واحد', unit:''},
                ],
                features: primaries.storeMainFeatures,
            },
            aging: {
                info: [
                    {type:'fromTo', headerName:'مبلغ اجاره', unit:'(به تومان)'},
                    {type:'fromTo', headerName:'مساحت زمین', unit:'(به متر مربع)'},
                    {type:'fromTo', headerName:'طول بر', unit:'(به متر)'},
                    {type:'dropDown', headerName:'نوع کاربری', data: primaries.agingApplicationTypes,},
                ],
                features: [],
            },
            ground: {
                info: [
                    {type:'fromTo', headerName:'مبلغ اجاره', unit:'(به تومان)'},
                    {type:'fromTo', headerName:'مساحت زمین', unit:'(به متر مربع)'},
                    {type:'fromTo', headerName:'طول بر', unit:'(به متر)'},
                    {type:'dropDown', headerName:'نوع کاربری', data: primaries.groundApplicationTypes,},
                ],
                features: [],
            },
            garden: {
                info: [
                    {type:'fromTo', headerName:'مبلغ اجاره', unit:'(به تومان)'},
                    {type:'fromTo', headerName:'مساحت زمین', unit:'(به متر مربع)'},
                ],
                features: primaries.gardenMainFeatures,
            },
            gardenVilla: {
                info: [
                    {type:'fromTo', headerName:'مبلغ اجاره', unit:'(به تومان)'},
                    {type:'fromTo', headerName:'زیربنا', unit:'(به متر مربع)'},
                    {type:'fromTo', headerName:'تعداد اتاق خواب', unit:''},
                    {type:'fromTo', headerName:'مساحت زمین', unit:'(به متر مربع)'},
                ],
                features: primaries.gardenVillaMainFeatures,
            },
        },
        
    }
});