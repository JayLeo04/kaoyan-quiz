#import <AppKit/AppKit.h>
#import <Foundation/Foundation.h>
#import <Vision/Vision.h>

int main(int argc, const char *argv[]) {
    @autoreleasepool {
        if (argc < 3) {
            fprintf(stderr, "Usage: ocr_pdf_pages OUTPUT.json PAGE.png...\n");
            return 2;
        }

        NSString *outputPath = [NSString stringWithUTF8String:argv[1]];
        NSMutableArray *pages = [NSMutableArray array];

        for (int index = 2; index < argc; index++) {
            NSString *pagePath = [NSString stringWithUTF8String:argv[index]];
            NSImage *image = [[NSImage alloc] initWithContentsOfFile:pagePath];
            CGImageRef cgImage = [image CGImageForProposedRect:NULL context:nil hints:nil];
            if (!cgImage) {
                fprintf(stderr, "Cannot load %s\n", argv[index]);
                return 1;
            }

            VNRecognizeTextRequest *request = [[VNRecognizeTextRequest alloc] init];
            request.recognitionLevel = VNRequestTextRecognitionLevelAccurate;
            request.usesLanguageCorrection = YES;
            request.recognitionLanguages = @[@"zh-Hans", @"en-US"];
            request.minimumTextHeight = 0.006;

            VNImageRequestHandler *handler = [[VNImageRequestHandler alloc] initWithCGImage:cgImage options:@{}];
            NSError *error = nil;
            if (![handler performRequests:@[request] error:&error]) {
                fprintf(stderr, "%s\n", error.localizedDescription.UTF8String);
                return 1;
            }

            NSMutableArray *lines = [NSMutableArray array];
            for (VNRecognizedTextObservation *observation in request.results) {
                VNRecognizedText *candidate = [[observation topCandidates:1] firstObject];
                if (!candidate) continue;
                CGRect box = observation.boundingBox;
                [lines addObject:@{
                    @"text": candidate.string,
                    @"x": @(box.origin.x),
                    @"y": @(box.origin.y),
                    @"width": @(box.size.width),
                    @"height": @(box.size.height)
                }];
            }

            [lines sortUsingComparator:^NSComparisonResult(NSDictionary *left, NSDictionary *right) {
                double leftY = [left[@"y"] doubleValue];
                double rightY = [right[@"y"] doubleValue];
                double threshold = MAX([left[@"height"] doubleValue], [right[@"height"] doubleValue]) * 0.55;
                if (fabs(leftY - rightY) > threshold) return leftY > rightY ? NSOrderedAscending : NSOrderedDescending;
                double leftX = [left[@"x"] doubleValue];
                double rightX = [right[@"x"] doubleValue];
                if (leftX == rightX) return NSOrderedSame;
                return leftX < rightX ? NSOrderedAscending : NSOrderedDescending;
            }];

            [pages addObject:@{
                @"file": pagePath.lastPathComponent,
                @"lines": lines
            }];
        }

        NSError *error = nil;
        NSData *json = [NSJSONSerialization dataWithJSONObject:pages options:NSJSONWritingPrettyPrinted error:&error];
        if (!json || ![json writeToFile:outputPath options:NSDataWritingAtomic error:&error]) {
            fprintf(stderr, "%s\n", error.localizedDescription.UTF8String);
            return 1;
        }
        printf("Wrote OCR for %lu pages to %s\n", (unsigned long)pages.count, outputPath.UTF8String);
    }
    return 0;
}
